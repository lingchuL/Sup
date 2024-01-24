from subprocess import Popen, PIPE


class UtilHandler(object):
	@staticmethod
	def str_is_float(in_str: str) -> bool:
		str_list = in_str.split('.')
		if len(str_list) > 2:
			return False
		for i in range(len(str_list)):
			if not str_list[i].isdigit():
				return False
		return True

	@staticmethod
	def call_cmd(cmd: str, show_shell=False) -> bool:
		p = Popen(rf"{cmd}", shell=show_shell)
		p.wait()
		return p.returncode

	@staticmethod
	def call_cmd_skip_pause(cmd: str, show_shell=False) -> bool:
		p = Popen(rf"{cmd}", shell=show_shell, stdin=PIPE)
		p.stdin.write(b"\r\n")
		p.stdin.close()
		p.wait()
		return p.returncode


util_handler = UtilHandler()
