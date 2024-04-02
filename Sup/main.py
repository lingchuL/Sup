import os
import time
from subprocess import Popen


def call_cmd_wait(in_cmd):
	try:
		p = Popen(in_cmd, shell=True)
		p.wait()
		return p.returncode
	except Exception as e:
		print(e)
		exit(1)


def call_cmd_nowait(in_cmd):
	try:
		p = Popen(in_cmd, shell=True)
	except Exception as e:
		print(e)
		exit(1)


if __name__ == "__main__":
	has_npm_installed = False
	with open("./npm_log.txt", "r") as f:
		content = f.read()
		if content == "done":
			has_npm_installed = True

	if not has_npm_installed:
		call_cmd_wait(r".\nvm-noinstall\nvm.exe install 20.10.0")
		call_cmd_wait(r".\nvm-noinstall\nvm.exe use 20.10.0")
		# call_cmd_wait(r"npm config set registry https://registry.npmmirror.com")
		call_cmd_wait(r"npm install")
		with open("./npm_log.txt", "w+") as f:
			f.write("done")
	call_cmd_nowait(r"npm run next_start")
	time.sleep(5)
	call_cmd_nowait(r".\electron_out\supfront.exe")
	call_cmd_nowait(r".\supback\supback.exe")

