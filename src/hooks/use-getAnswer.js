import { useEffect, useState } from "react";

const useGetAnswer = (applyData) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [rateOfConfusedAnwser, setRateOfConfusedAnwser] = useState(0);
  const [numberConfusedAnwer, setNumberConfusedAnswer] = useState(0);
  const [numberAnwer, setNumberAnswer] = useState(0);
  const [isConfuse, setIsConfuse] = useState(false);

  const resetRate = () => {
    setNumberAnswer(0);
    setNumberConfusedAnswer(0);
  };

  const sendRequest = async (input) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://cbe-cap2.herokuapp.com/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();
      setNumberAnswer(numberAnwer + 1);

      if (!data.tag) {
        setNumberConfusedAnswer(numberConfusedAnwer + 1);
        setIsConfuse(true);
      } else {
        setIsConfuse(false);
      }
      applyData(data.mess);
    } catch (err) {
      setError(err.message || Math.random());
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setRateOfConfusedAnwser(numberConfusedAnwer / numberAnwer);
  }, [numberConfusedAnwer, numberAnwer]);

  return {
    isLoading: isLoading,
    error: error,
    sendRequest: sendRequest,
    rateOfConfusedAnwser,
    numberAnwer,
    resetRate,
    isConfuse,
  };
};

export default useGetAnswer;
