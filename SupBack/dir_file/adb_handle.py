from utils.util_handle import util_handler


class ADBHandler(object):
	def __init__(self):
		pass

	def is_adb_valid(self):
		pass

	def has_devices(self):
		pass

	@staticmethod
	def install(apk_path):
		adb_cmd = f"adb install {apk_path}"
		util_handler.call_cmd(adb_cmd)

	@staticmethod
	def uninstall(package_name, keep_data=False):
		if keep_data:
			adb_cmd = f"adb shell pm uninstall -k {package_name}"
		else:
			adb_cmd = f"adb uninstall {package_name}"
		util_handler.call_cmd(adb_cmd)
