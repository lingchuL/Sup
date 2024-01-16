from settings.copilot_setting import CopilotSetting


class SpeechToTextHandler(object):
	def __init__(self, in_setting=CopilotSetting()):
		self.setting = in_setting


class OpenAIWhisper(SpeechToTextHandler):
	def __init__(self):
		super(OpenAIWhisper, self).__init__()
		self.openai_api_key = self.setting.openai_api_key

	def speech_to_text(self, in_speech_data):
		pass
