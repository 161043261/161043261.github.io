from os.path import exists
from sys import argv, exit


def sortLines(filepath: str):
    if not exists(filepath):
        print(f"-- Error: {filepath} not found")
        return

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            lines = f.readlines()
            lines.sort()

        with open(filepath, "w", encoding="utf-8") as f:
            f.writelines(lines)

    except Exception as e:
        print(f"-- Error: {e}")


if __name__ == "__main__":
    if len(argv) < 2:
        print("-- Usage: python3 ./sort-lines.py <filepath>")
        exit(1)

    filepath = argv[1]
    sortLines(filepath)
