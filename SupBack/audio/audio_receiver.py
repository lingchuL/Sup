from base_class.request_receiver import RequestReceiver

from audio.bpm_handle import BPMHandler
from audio.freq_note_handle import FreqNoteHandler


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
			"spb_to_bpm": self.spb_to_bpm
		}

	def note_to_freq(self):
		note = self.unquote_arg(self.arg_dict["note"])
		handler = FreqNoteHandler()
		freq = handler.get_note_freq(note)
		return self.form_result_dict(freq)

	def freq_to_note(self):
		freq = self.arg_dict["freq"]
		handler = FreqNoteHandler()
		note = handler.get_freq_near_note(float(freq))
		return self.form_result_dict(note)

	def bpm_to_spb(self):
		bpm = self.arg_dict["bpm"]
		bpm_handler = BPMHandler()
		spb = bpm_handler.spb_of_bpm(float(bpm))
		return self.form_result_dict(spb)

	def spb_to_bpm(self):
		spb = self.arg_dict["spb"]
		bpm_handler = BPMHandler()
		bpm = bpm_handler.bpm_of_spb(float(spb))
		return self.form_result_dict(bpm)
