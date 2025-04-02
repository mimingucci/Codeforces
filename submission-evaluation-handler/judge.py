from multiprocessing import Pool
import psutil


def _run(instance, src: str, input: str, output: str):
    return instance._judge_one(src, input, output)

class Judge(object):
    def __init__(self, src: str, inputs: list[str], outputs: list[str]) -> None:
        self.src = src
        self.inputs = inputs
        self.outputs = outputs
    
    def _judge_one(self, src: str, input: str, output: str):
        pass

    def run(self):
        tmp_result = []
        result = []
        pool = Pool(processes=psutil.cpu_count())
        try:
            for test_case_id in len(self.inputs):
                tmp_result.append(pool.apply_async(_run, (self, self.src, self.inputs[test_case_id], self.outputs[test_case_id])))
        except Exception as e:
            raise e
        finally:
            pool.close()
            pool.join()
        for item in tmp_result:
            # exception will be raised, when get() is called
            # http://stackoverflow.com/questions/22094852/how-to-catch-exceptions-in-workers-in-multiprocessing
            result.append(item.get())
        return result