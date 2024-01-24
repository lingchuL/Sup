from base_class.cfg_handle import CfgHandler


class AbilityAudioCfgHandler(CfgHandler):
	def add_attr_names(self):
		self.xlsx_handler.add_attr_name(["B", "A", "C", "E"], 4)
		self.xlsx_handler.add_attr_name_range(["G", "H"], 4)
		self.xlsx_handler.add_attr_name_range(["V", "W"], 4)

	def form_row(self, in_row: dict) -> dict:
		row_dict = {
			"key": in_row["pk"],
			"attr_names": ["desc", "triggerEventTags", "finishEventTags", "castSfx", "castSfxTime"],
			"attr_values": [],
			"attr_is_editable": []
		}
		attr_display_names = ["desc", "triggerEventTags", "finishEventTags", "castSfx", "castSfxTime"]
		for attr_name in attr_display_names:
			attr_value = in_row[attr_name]
			# if attr_value is None or attr_value == "":
			# 	attr_value = "None"
			row_dict["attr_values"].append(attr_value)
			row_dict["attr_is_editable"].append(False)

		return row_dict

	def set_attr_dict(self, in_attr_dict):
		pk = in_attr_dict["pk"]
		attr_dict = self.search_row_by_id(pk)

		for attr_name in in_attr_dict.keys():
			attr_dict[attr_name] = in_attr_dict[attr_name]

		self.set_row_dict_or_add(pk, attr_dict)

		print(self.search_row_by_id(pk))

	def delete(self, id_: str):
		self.delete_id(id_)


class EntityCfgHandler(CfgHandler):
	def add_attr_names(self):
		self.xlsx_handler.add_attr_name(["C", "B"], 4)
		self.xlsx_handler.add_attr_name_range(["K", "AG"], 4)

	def set_ability_or_add(self, in_pk, in_ability_name):
		attr_dict = self.search_row_by_id(in_pk)

		ability_name = f"_{in_ability_name}"
		attr_name = self.get_first_match_attr_name(in_pk, ability_name)
		attr_dict[attr_name] = ability_name

		self.set_row_dict_or_add(in_pk, attr_dict)

	def delete_ability(self, in_pk, in_ability_name):
		attr_dict = self.search_row_by_id(in_pk)

		ability_name = f"_{in_ability_name}"
		attr_name = self.get_first_match_attr_name(in_pk, ability_name)
		attr_dict[attr_name] = ""
		print(attr_dict)

		self.set_row_dict_or_add(in_pk, attr_dict)


class ItemCfgHandler(CfgHandler):
	def add_attr_names(self):
		self.xlsx_handler.add_attr_name(["C", "B", "R"], 4)
		self.xlsx_handler.add_attr_name_range(["X", "Z"], 3)
		self.xlsx_handler.add_attr_name_range(["AA", "AC"], 4)

	def form_row(self, in_row: dict) -> dict:
		row_dict = {
			"key": in_row["pk"],
			"attr_names": ["name", "entityPk", "action1", "action2", "action3"],
			"attr_values": [],
			"attr_is_editable": []
		}
		attr_display_names = ["名字", "entityPk", "动作1", "动作2", "动作3"]
		for attr_name in attr_display_names:
			attr_value = in_row[attr_name]
			if attr_value is None or attr_value == "":
				attr_value = "None"
			row_dict["attr_values"].append(attr_value)
			row_dict["attr_is_editable"].append(False)

		return row_dict

	def get_entity_pk(self, in_pk):
		attr_dict = self.search_row_by_id(in_pk)
		if "entityPk" in attr_dict:
			return attr_dict["entityPk"]
		else:
			return ""

	def get_action_tag(self, in_pk, in_action_index_str: str):
		action_index = int(in_action_index_str) - 1
		attr_dict = self.search_row_by_id(in_pk)
		action_index = self.xlsx_handler.col_handler.num_of_col("AA") + action_index
		action_col = self.xlsx_handler.col_handler.col_of_num(action_index)

		_action_tag: str = attr_dict[action_col]
		if _action_tag is None or _action_tag == "":
			return ""

		_action_tag = _action_tag.replace(r",", "")
		_action_tag = _action_tag.replace("\"", "")

		return _action_tag


if __name__ == "__main__":
	item_pk = "Fire_Extinguisher_get"
	item_action_index = 0

	item_cfg_handler = ItemCfgHandler()
	item_cfg_handler.load(r"e:\Workflow\Block-wangjunyi.42-trunk\Client\Data\JungoTownRP\3_物品配置_RP.xlsx", "pk", 0)
	item_attr_dict = item_cfg_handler.search_row_by_id(item_pk)
	print(item_cfg_handler.search_row_list(item_pk))
	assert "名字" in item_attr_dict.keys()
	item_name = item_attr_dict["名字"]
	entity_pk = item_cfg_handler.get_entity_pk(item_pk)
	action_tag = item_cfg_handler.get_action_tag("Fire_Extinguisher_get", item_action_index)
	print(entity_pk)
	print(action_tag)

	ability_pk = f"{item_pk}_{str(item_action_index + 1)}"

	ability_handler = AbilityAudioCfgHandler()
	ability_handler.load(r"e:\Workflow\Block-wangjunyi.42-trunk\Client\Data\JungoWorld\Ability.xlsx", "pk", 6)
	ability_handler.set_attr_dict({
		"pk": ability_pk,
		"desc": f"{item_name}0{str(item_action_index + 1)}",
		"abilityTags": "Asset.Item.Tools",
		"blockAbilitiesWithTags": "Asset.Item.Tools",
		"triggerEventTags": action_tag,
		"finishEventTags": "Event.Input.SwitchPose",
		"castSfx": "HO_Guitar_Skill_Play",
		"castSfxTime": 0
	})
	# handler.write_save_id("Guitar_get_2")

	entity_handler = EntityCfgHandler()
	entity_handler.load(r"e:\Workflow\Block-wangjunyi.42-trunk\Client\Data\JungoTownRP\2_Entity配置_RP.xlsx", "pk", 0)
	entity_handler.set_ability_or_add(entity_pk, ability_pk)
	# print(f"Entity配置 {entity_handler.search_row_by_id(entity_pk)}")
	print(entity_handler.search_row_list(entity_pk))