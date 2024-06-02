import logging

from Wrappers import singleton

@singleton
class Logger:
    
    def __init__(self, level: int = logging.INFO) -> None:
        self._level = level
        self._logger = logging.getLogger('logger')
        self._logger.setLevel(self._level)
        console_handler = logging.StreamHandler()
        console_handler.setLevel(self._level)
        formatter = logging.Formatter('[%(levelname)s] - %(asctime)s: %(message)s')
        console_handler.setFormatter(formatter)
        self._logger.addHandler(console_handler)

    def debug(self, msg: str) -> None:
        self._logger.debug(msg)

    def info(self, msg: str) -> None:
        self._logger.info(msg)

    def warning(self, msg: str) -> None:
        self._logger.warning(msg)

    def error(self, msg: str) -> None:
        self._logger.error(msg)

    def critical(self, msg: str) -> None:
        self._logger.critical(msg)
