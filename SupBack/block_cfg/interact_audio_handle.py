from excel.xlsx_handle import XlsxHandler


class InteractAudioCfg(object):
	def __init__(self):
		self.desc = ""
		self.id_ = ""
		self.guid = ""
		self.action1 = ""
		self.action2 = ""



class InteractAudioCfgHandler(object):
	def __init__(self):
		self.xlsx_handler = XlsxHandler()

	def load_cfg(self, in_cfg_path):
