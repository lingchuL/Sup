info_dict = {
	"file not found": "File not found",
	"col range must be two": "Col range must be two",
}


class SupLogger(object):
	def __init__(self):
		pass

	@staticmethod
	def info(info_idx):
		print(f"[Info] {info_idx}")
		if info_idx in info_dict:
			print(f"[Info] {info_dict[info_idx]}")