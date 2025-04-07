import json

import httpx
import py_eureka_client.eureka_client as eureka_client
from fastapi import HTTPException
from circuitbreaker import circuit
from typing import Dict, Any, Optional, Union

class ServiceClient:
    """
    Client for making synchronous requests to other microservices registered with Eureka
    """
    
    @staticmethod
    @circuit(failure_threshold=3, recovery_timeout=10)
    async def get(service_name: str, endpoint: str, params: str = None,
                 headers: Optional[Dict[str, str]] = None, timeout: float = 10.0) -> Any:
        """
        Make a GET request to another microservice
        
        Args:
            service_name: Name of the service registered in Eureka
            endpoint: API endpoint path (should start with /)
            params: Optional query parameters
            headers: Optional request headers
            timeout: Request timeout in seconds
            
        Returns:
            Parsed JSON response
        """
        try:
            res = await eureka_client.do_service_async(service_name,
                                                       endpoint,
                                                       params,
                                                       headers=headers,
                                                       timeout=timeout,
                                                       method="GET")
            return res
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, 
                               detail=f"Error from {service_name} service: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, 
                               detail=f"Service {service_name} unreachable: {str(e)}")

    @staticmethod
    @circuit(failure_threshold=3, recovery_timeout=10)
    async def post(service_name: str, endpoint: str, json_data: Optional[Dict[str, Any]] = None,
                  params: str = None, headers: Optional[Dict[str, str]] = None,
                  timeout: float = 10.0) -> Any:
        """
        Make a POST request to another microservice
        
        Args:
            service_name: Name of the service registered in Eureka
            endpoint: API endpoint path (should start with /)
            json_data: JSON data to send in the request body
            params: Optional query parameters
            headers: Optional request headers
            timeout: Request timeout in seconds
            
        Returns:
            Parsed JSON response
        """
        try:
            res = await eureka_client.do_service_async(service_name,
                                                       endpoint,
                                                       params,
                                                       data=json.dumps(json_data),
                                                       headers=headers,
                                                       timeout=timeout,
                                                       method="POST")
            return res
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, 
                               detail=f"Error from {service_name} service: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, 
                               detail=f"Service {service_name} unreachable: {str(e)}")
    
    @staticmethod
    @circuit(failure_threshold=3, recovery_timeout=10)
    async def put(service_name: str, endpoint: str, json_data: Optional[Dict[str, Any]] = None,
                 params: str = None, headers: Optional[Dict[str, str]] = None,
                 timeout: float = 10.0) -> Any:
        """
        Make a PUT request to another microservice
        
        Args:
            service_name: Name of the service registered in Eureka
            endpoint: API endpoint path (should start with /)
            json_data: JSON data to send in the request body
            params: Optional query parameters
            headers: Optional request headers
            timeout: Request timeout in seconds
            
        Returns:
            Parsed JSON response
        """
        try:
            res = await eureka_client.do_service_async(service_name,
                                                       endpoint,
                                                       params,
                                                       data=json.dumps(json_data),
                                                       headers=headers,
                                                       timeout=timeout,
                                                       method="PUT")
            return res
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, 
                               detail=f"Error from {service_name} service: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, 
                               detail=f"Service {service_name} unreachable: {str(e)}")

    @staticmethod
    @circuit(failure_threshold=3, recovery_timeout=10)
    async def delete(service_name: str, endpoint: str, params: str = None,
                    headers: Optional[Dict[str, str]] = None, timeout: float = 10.0) -> Any:
        """
        Make a DELETE request to another microservice
        
        Args:
            service_name: Name of the service registered in Eureka
            endpoint: API endpoint path (should start with /)
            params: Optional query parameters
            headers: Optional request headers
            timeout: Request timeout in seconds
            
        Returns:
            Parsed JSON response
        """
        try:
            res = await eureka_client.do_service_async(service_name,
                                                       endpoint,
                                                       params,
                                                       headers=headers,
                                                       timeout=timeout,
                                                       method="DELETE")
            return res
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, 
                               detail=f"Error from {service_name} service: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, 
                               detail=f"Service {service_name} unreachable: {str(e)}")