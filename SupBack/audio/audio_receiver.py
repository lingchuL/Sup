from base_class.request_receiver import RequestReceiver

from utils.util_handle import util_handler

from audio.bpm_handle import BPMHandler
from audio.freq_note_handle import FreqNoteHandler
from audio.text_to_speech_handle import OpenAITTS


class AudioReceiver(RequestReceiver):
	def init_arg_name_list(self):
		self.arg_name_list = [
			"action",
			"note", "freq",
			"bpm", "spb"
		]

	def init_action_func_dict(self):
		self.action_func_dict = {
			"note_to_freq": self.note_to_freq,
			"freq_to_note": self.freq_to_note,
			"bpm_to_spb": self.bpm_to_spb,
			"spb_to_bpm": self.spb_to_bpm,
			"tts": self.tts
		}

	def note_to_freq(self):
		note = self.unquote_arg(self.arg_dict["note"])
		handler = FreqNoteHandler()
		freq = handler.get_note_freq(note)
		return self.form_result_dict(freq)

	def freq_to_note(self):
		freq = self.arg_dict["freq"]
		if not util_handler.str_is_float(freq):
			return self.form_result_dict("", -1)
		handler = FreqNoteHandler()
		note = handler.get_freq_near_note(float(freq))
		return self.form_result_dict(note)

	def bpm_to_spb(self):
		bpm = self.arg_dict["bpm"]
		if not util_handler.str_is_float(bpm):
			return self.form_result_dict("", -1)
		bpm_handler = BPMHandler()
		spb = bpm_handler.spb_of_bpm(float(bpm))
		return self.form_result_dict(spb)

	def spb_to_bpm(self):
		spb = self.arg_dict["spb"]
		if not util_handler.str_is_float(spb):
			return self.form_result_dict("", -1)
		bpm_handler = BPMHandler()
		bpm = bpm_handler.bpm_of_spb(float(spb))
		return self.form_result_dict(bpm)

	def tts(self):
		text = self.arg_dict["text"]
		if text == "":
			return self.form_result_dict("Empty text", -1)
		speaker = OpenAITTS()
		speaker.speak(text)
