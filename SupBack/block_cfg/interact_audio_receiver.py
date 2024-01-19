import os.path

from subprocess import Popen, PIPE

from base_class.request_receiver import RequestReceiver

from block_cfg.interact_audio_handle import InteractAudioCfgHandler


class InteractAudioReceiver(RequestReceiver):
	def init_arg_name_list(self):
		self.arg_name_list = [
			"action",
			"projectDir",
			"column",
			"search",
			"sfx_start",
			"sfx_end",
		]

	def init_action_func_dict(self):
		self.action_func_dict = {
			"search": self.search,
			"write_save_id": self.write_save_id,
			"convert_rp_cfg": self.convert_rp_cfg
		}

	def search(self):
		project_dir = self.unquote_arg(self.arg_dict["projectDir"])
		cfg_file_path = os.path.join(project_dir, self.settings.voxel_relative_path)

		search_name = self.unquote_arg(self.arg_dict["search"])

		# print(cfg_file_path)
		handler = InteractAudioCfgHandler()
		handler.load(cfg_file_path, "id")

		search_result = handler.search_row_list(search_name)

		status_code = "0"

		return self.form_result_dict(search_result, status_code)

	def write_save_id(self):
		project_dir = self.unquote_arg(self.arg_dict["projectDir"])
		cfg_file_path = os.path.join(project_dir, self.settings.voxel_relative_path)

		id_ = self.arg_dict["search"]
		sfx_start = self.arg_dict["sfx_start"]
		sfx_end = self.arg_dict["sfx_end"]

		handler = InteractAudioCfgHandler()
		handler.load(cfg_file_path, "id")

		should_save = False if sfx_start is None and sfx_end is None else True

		if sfx_start != "":
			handler.set_rp_interact_sound(id_, sfx_start, "sfx_start")
		else:
			handler.remove_rp_interact_sound(id_, "sfx_start")
		if sfx_end != "":
			handler.set_rp_interact_sound(id_, sfx_end, "sfx_end")
		else:
			handler.remove_rp_interact_sound(id_, "sfx_end")

		if should_save:
			handler.write_save_id(id_)

		status_code = "0"

		return self.form_result_dict("Finished", status_code)

	@staticmethod
	def call_bat(in_bat_path):
		# 输入回车跳过 pause
		p = Popen(rf"{in_bat_path}", shell=True, stdin=PIPE)
		p.stdin.write(b"\r\n")
		p.stdin.close()
		p.wait()
		ret_code = p.returncode
		print(ret_code)

		return ret_code

	def convert_rp_cfg(self):
		project_dir = self.unquote_arg(self.arg_dict["projectDir"])
		convert_rp_bat_path = os.path.join(project_dir, self.settings.convert_rp_cfg_relative_path)

		print(convert_rp_bat_path)

		ret_code = self.call_bat(convert_rp_bat_path)
		if ret_code == 0:
			status_code = "0"
		else:
			status_code = "-1"

		return self.form_result_dict("Finished", status_code)
