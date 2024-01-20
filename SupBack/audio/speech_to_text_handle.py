from settings.copilot_setting import CopilotSetting


class STTHandler(object):
	def __init__(self, in_setting=CopilotSetting()):
		self.setting = in_setting


class OpenAISTT(STTHandler):
	def __init__(self, in_setting=CopilotSetting()):
		super().__init__(in_setting)

	def speech_to_text(self, in_speech_data):
		pass
