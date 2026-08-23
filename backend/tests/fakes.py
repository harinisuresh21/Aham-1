from collections import defaultdict

from datetime import datetime, timezone


def fixed_timestamp() -> datetime:
    return datetime(2026, 1, 1, tzinfo=timezone.utc)


class FakeQuery:
    def __init__(self, queue: list, owner_db: "FakeDB") -> None:
        self._queue = queue
        self._owner_db = owner_db

    def filter(self, *criteria):
        return self

    def filter_by(self, **kwargs):
        return self

    def order_by(self, *criterion):
        return self

    def offset(self, offset_value):
        return self

    def limit(self, limit_value):
        return self

    def first(self):
        return self._queue.pop(0) if self._queue else None

    def all(self):
        return self._queue.pop(0) if self._queue else []

    def count(self):
        return self._queue.pop(0) if self._queue else 0

    def update(self, values, synchronize_session=None):
        self._owner_db.updates.append(values)
        return 1


class FakeDB:
    def __init__(self) -> None:
        self._queues: dict[type, list] = defaultdict(list)
        self.added: list = []
        self.deleted: list = []
        self.updates: list[dict] = []
        self.commit_count = 0

    def enqueue(self, model, result) -> None:
        self._queues[model].append(result)

    def query(self, model):
        return FakeQuery(self._queues[model], self)

    def add(self, obj) -> None:
        self.added.append(obj)

    def commit(self) -> None:
        self.commit_count += 1

    def refresh(self, obj) -> None:
        pass

    def delete(self, obj) -> None:
        self.deleted.append(obj)
