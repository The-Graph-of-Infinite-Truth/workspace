import os
import time
import subprocess
import re
import json

WORKSPACE_DIR = r"c:\Users\user\oxp_workspace\the_git\GIT"
WORD_DIR = os.path.join(WORKSPACE_DIR, "data", "epoch_of_word")

def run_git(args):
    print(f"Running git {' '.join(args)}")
    res = subprocess.run(["git"] + args, cwd=WORKSPACE_DIR, capture_output=True, text=True)
    print("STDOUT:", res.stdout)
    print("STDERR:", res.stderr)
    return res.returncode == 0

def check_and_commit():
    # state.json 확인
    state_path = os.path.join(WORD_DIR, "state.json")
    if not os.path.exists(state_path):
        return
        
    try:
        with open(state_path, "r", encoding="utf-8") as f:
            state = json.load(f)
        next_word_id = state.get("next_word_id", 0)
    except Exception as e:
        print("Error reading state.json:", e)
        return

    # 이미 커밋한 최신 word_id 저장용 파일
    last_committed_path = os.path.join(WORD_DIR, ".last_committed")
    last_committed = 0
    if os.path.exists(last_committed_path):
        try:
            with open(last_committed_path, "r") as f:
                last_committed = int(f.read().strip())
        except Exception:
            pass

    # next_word_id - 1 이 커밋 대상
    target_id = next_word_id - 1
    if target_id <= last_committed or target_id <= 0:
        return

    # Word_XXX.md 파일이 있는지 확인
    word_file_name = f"Word_{target_id:03d}.md"
    word_file_path = os.path.join(WORD_DIR, word_file_name)
    if not os.path.exists(word_file_path):
        print(f"File {word_file_name} not found yet.")
        return

    # Goal 요약 추출
    try:
        with open(word_file_path, "r", encoding="utf-8") as f:
            content = f.read()
        # '# Word XXX: [Goal 요약]' 형식에서 추출
        match = re.search(r"^#\s+Word\s+\d+:\s*(.*)$", content, re.MULTILINE)
        if match:
            goal_summary = match.group(1).strip()
        else:
            goal_summary = f"Create Word {target_id:03d}"
    except Exception as e:
        print("Error reading word file:", e)
        goal_summary = f"Create Word {target_id:03d}"

    commit_message = f"Word {target_id:03d}: {goal_summary}"
    
    # Git add, commit, push
    if run_git(["add", "."]):
        if run_git(["commit", "-m", commit_message]):
            # push 시도
            push_success = run_git(["push"])
            if not push_success:
                print("Push failed, trying pull --rebase...")
                run_git(["pull", "--rebase"])
                run_git(["push"])
                
            # 성공 시 기록
            with open(last_committed_path, "w") as f:
                f.write(str(target_id))
            print(f"Successfully committed and pushed Word {target_id:03d}")

if __name__ == "__main__":
    print("Git Autosave Daemon started...")
    while True:
        try:
            check_and_commit()
        except Exception as e:
            print("Daemon error:", e)
        time.sleep(2)
