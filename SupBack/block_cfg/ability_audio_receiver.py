import os.path

from base_class.request_receiver import RequestReceiver
from block_cfg.ability_audio_handle import ItemCfgHandler, EntityCfgHandler, AbilityAudioCfgHandler


class AbilityAudioCfgReceiver(RequestReceiver):
	def init_arg_name_list(self):
		self.arg_name_list = [
			"action",
			"projectDir",
			"search",
			"action_name",
		]

	def handle_action(self):
		result_dict = {}
		if self.arg_dict["action"] == "search_item":
			result_dict = self.search_item()
		if self.arg_dict["action"] == "search_ability":
			result_dict = self.search_ability()

		return self.form_response(result_dict)

	def search_item(self):
		project_dir = self.unquote_arg(self.arg_dict["projectDir"])
		item_cfg_path = os.path.join(project_dir, r"Client\Data\JungoTownRP\3_物品配置_RP.xlsx")
		search_name = self.unquote_arg(self.arg_dict["search"])

		item_cfg_handler = ItemCfgHandler()
		item_cfg_handler.load(item_cfg_path, "pk", 0)
		result_dict = item_cfg_handler.search_row_list(search_name)
		return self.form_result_dict(result_dict, "0")

	def search_ability(self):
		project_dir = self.unquote_arg(self.arg_dict["projectDir"])
		ability_cfg_path = os.path.join(project_dir, r"Client\Data\JungoWorld\Ability.xlsx")
		item_pk = self.unquote_arg(self.arg_dict["search"])
		action_index = self.arg_dict["action_name"]

		is_search_with_action_name = False
		if action_index is None or action_index == "":
			ability_pk = item_pk
		else:
			action_index_str = action_index[-1]
			ability_pk = f"{item_pk}_{action_index_str}"
			is_search_with_action_name = True

		ability_cfg_handler = AbilityAudioCfgHandler()
		ability_cfg_handler.load(ability_cfg_path, "pk", 6)
		result_list = ability_cfg_handler.search_row_list(ability_pk)

		if is_search_with_action_name:
			if result_list:
				return self.form_result_dict(result_list, "0")
			else:
				item_cfg_path = os.path.join(project_dir, r"Client\Data\JungoTownRP\3_物品配置_RP.xlsx")

				item_cfg_handler = ItemCfgHandler()
				item_cfg_handler.load(item_cfg_path, "pk", 0)

				action_index_str = action_index[-1]
				action_tag = item_cfg_handler.get_action_tag(item_pk, int(action_index_str) - 1)
				if action_tag is None or action_tag == "":
					return self.form_result_dict(result_list, "0")

				ability_cfg_handler.set_attr_dict({
					"pk": f"{item_pk}_{action_index_str}",
					"desc": f"{item_pk}0{action_index_str}",
					"abilityTags": "Asset.Item.Tools",
					"blockAbilitiesWithTags": "Asset.Item.Tools",
					"triggerEventTags": action_tag,
					"finishEventTags": "Event.Input.SwitchPose",
					"castSfx": "",
					"castSfxTime": 0
				})
		else:
			item_cfg_path = os.path.join(project_dir, r"Client\Data\JungoTownRP\3_物品配置_RP.xlsx")

			item_cfg_handler = ItemCfgHandler()
			item_cfg_handler.load(item_cfg_path, "pk", 0)

			for action_index in range(3):
				action_index_str = str(action_index + 1)
				action_tag = item_cfg_handler.get_action_tag(item_pk, action_index)
				print(action_tag)
				if action_tag is None or action_tag == "":
					continue
				ability_row = ability_cfg_handler.search_row_by_id(f"{item_pk}_{action_index_str}")
				if ability_row is not None and ability_row != {}:
					continue
				ability_cfg_handler.set_attr_dict({
					"pk": f"{item_pk}_{action_index_str}",
					"desc": f"{item_pk}0{action_index_str}",
					"abilityTags": "Asset.Item.Tools",
					"blockAbilitiesWithTags": "Asset.Item.Tools",
					"triggerEventTags": action_tag,
					"finishEventTags": "Event.Input.SwitchPose",
					"castSfx": "",
					"castSfxTime": 0
				})

		result_list = ability_cfg_handler.search_row_list(ability_pk)
		return self.form_result_dict(result_list, "0")




