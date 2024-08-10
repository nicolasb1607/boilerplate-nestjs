# scripts/example.py
import sys
import json

def main():
    # Example script that takes an argument and returns a JSON response
    if len(sys.argv) > 1:
        name = sys.argv[1]
        result = {
            "message": f"Hello, {name}!",
            "success": True
        }
    else:
        result = {
            "message": "Hello, World!",
            "success": True
        }
    print(json.dum(result))

if __name__ == "__main__":
    main()
