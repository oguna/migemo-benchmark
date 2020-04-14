import bisect
from typing import List
import os


class MigemoDictionary:
    def __init__(self):
        self.keys = []
        self.values = []
        entries = []
        path = os.path.dirname(os.path.abspath(__file__)) + '/../migemo-dict'
        with open(path, encoding='UTF-8') as file:
            for line in file:
                if line.startswith(';') or len(line) == 0:
                    continue
                split = line.split('\t', 2)
                entries.append((split[0], split[1].strip()))
        entries.sort(key=lambda e: e[0])
        for (k, v) in entries:
            self.keys.append(k)
            self.values.append(v)

    def predictive_search(self, hiragana: str) -> List[str]:
        stop = hiragana[0: -1] + chr(ord(hiragana[-1]) + 1)
        start_pos = bisect.bisect_left(self.keys, hiragana)
        end_pos = bisect.bisect_left(self.keys, stop)
        result = []
        for i in self.values[start_pos: end_pos]:
            result.append(i)
        return result
