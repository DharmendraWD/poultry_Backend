import { useCallback, useEffect, useState } from "react";


export default function useApi(apiFunction, options = {}) {
  const {
    immediate = true,
    enabled = true,
    params = null,
  } = options;

  const [data, setData] = useState(null);
  const [loadingApi, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fetchData = useCallback(
    async (customParams = params) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const response = await apiFunction(customParams);
        setData(response);
 


      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

useEffect(() => {
  if (immediate && enabled && apiFunction) {
    fetchData();
  }
}, [fetchData, immediate, enabled, apiFunction]);

  return { data, loadingApi, error, success, refetch: fetchData };
}


// how to use 
// const { data, loadingApi, error, success, refetch } = useApi(
//   () => deleteUser(userId),
//   {
//     immediate: false,
//     showSuccess: true,
//   }
// );