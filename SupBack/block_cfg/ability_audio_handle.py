from base_class.cfg_handler import CfgHandler


class AbilityAudioCfgHandler(CfgHandler):
	def add_attr_names(self):
		self.xlsx_handler.add_attr_name(["B", "C", "A"], 4)
		self.xlsx_handler.add_attr_name_by_range(["G", "H"], 4)
		self.xlsx_handler.add_attr_name_by_range(["V", "W"], 4)


if __name__ == "__main__":
	handler = AbilityAudioCfgHandler()
	handler.load(r"e:\Workflow\Block-wangjunyi.42-stable\Client\Data\JungoWorld\Ability.xlsx", "pk", 6)
	print(handler.get_cfg_dict("Guitar_get_2"))
