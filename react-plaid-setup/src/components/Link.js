import React, { useState, useCallback, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "axios";
import qs from "qs";


const tokenURL = `http://localhost:8080/api/v1/accounts/link-token`;
const sendTokenURL = `http://localhost:8080/api/v1/accounts/link`;

const  Link = () => {
  const [data, setData] = useState("");

  const fetchToken = useCallback(async () => {
    
    const config = {
      method: "post",
      url: tokenURL,
      headers: {"Authorization" : "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJiYmJAZ21haWwuY29tIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTY1NzA5OTg3MH0.v4vhD44jLVqNL1SMClfxBDOBopuJPsCma7nZ3PSWH7Q3QT1G0l6RFtFK1bA1YdNatAflkIcwcAJcwpBDOxS5oQ"}
    };
    const res = await axios(config);
    console.log(res)
    setData(res.data.responseBody.token);
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  const onSuccess = useCallback(async (token, metadata) => {

    console.log(metadata)
    console.log(token)
    // send token to server
    const config = {
      method: "post",
      url: sendTokenURL,
      data: 
        { 
          publicToken: metadata.public_token,
          accountId: metadata.account.id,
          accountName:metadata.account.name,
          institutionName:metadata.institution.name
         },
      headers: {"Authorization" : "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJiYmJAZ21haWwuY29tIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTY1NzA5OTg3MH0.v4vhD44jLVqNL1SMClfxBDOBopuJPsCma7nZ3PSWH7Q3QT1G0l6RFtFK1bA1YdNatAflkIcwcAJcwpBDOxS5oQ", "content-type": "application/json"}

    };
    try {
      const response = await axios(config);
      console.log(response)
    } catch (error) {
      console.error(error);
    }

  }, []);

  const config = {
    token: data,
    onSuccess,
  };

  const { open, ready, err } = usePlaidLink(config);

  if (err) return <p>Error!</p>;

  return (
    <div>
      <button onClick={() => open()} disabled={!ready}>
        Connect a bank account
      </button>
    </div>
  );
}

export default Link;