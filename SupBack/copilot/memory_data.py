class MemoryData(object):
	def __init__(self):
		self.id_ = ""
		self.desc = ""
		self.attr_name_list = []
		self.attr_dict = {}

		self.init_attr_names()
		self.init_attr_dict()

	def init_attr_names(self):
		pass

	def init_attr_dict(self):
		for attr_name in self.attr_name_list:
			self.attr_dict[attr_name] = ""

