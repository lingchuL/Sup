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
		search_name = self.unquote_arg(self.arg_dict["search"])
		action_name = self.arg_dict["action_name"]

		if action_name is None or action_name == "":
			ability_pk = search_name
		else:
			action_index_str = action_name[-1]
			ability_pk = f"{search_name}_{action_index_str}"

		ability_cfg_handler = AbilityAudioCfgHandler()
		ability_cfg_handler.load(ability_cfg_path, "pk", 6)
		result_dict = ability_cfg_handler.search_row_list(ability_pk)

		return self.form_result_dict(result_dict, "0")


