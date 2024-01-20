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


util_handler = UtilHandler()
