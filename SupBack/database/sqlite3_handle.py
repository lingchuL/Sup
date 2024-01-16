import sqlite3


class Sql3Handler(object):
	def __init__(self):
		self.conn = None
		self.cursor = None

	def connect(self, db_name):
		self.conn = sqlite3.connect(db_name)
		self.cursor = self.conn.cursor()

	def close(self):
		self.cursor.close()
		self.conn.close()

	def execute(self, sql):
		self.cursor.execute(sql)

	def fetchall(self):
		return self.cursor.fetchall()

	def fetchone(self):
		return self.cursor.fetchone()

	def commit(self):
		self.conn.commit()


if __name__ == '__main__':
	handler = Sql3Handler()
	handler.connect('test.db')
