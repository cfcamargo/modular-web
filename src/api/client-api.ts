import { api } from "@/lib/axios";
import { IClientApi } from "./interface/client-api";
import {
  ClientDetailsResponse,
  ClientResponse,
} from "@/models/responses/client-response";
import { ClientRequest } from "@/models/requests/client-request";
import { MetaProps } from "@/models/responses/meta-response";

const baseURL = "/clients";
export class ClientApi extends IClientApi {
  get(page: number): Promise<{
    data: { clients: { meta: MetaProps; data: ClientResponse[] } };
  }> {
    return api.get(`${baseURL}?page=${page}`);
  }
  save(request: ClientRequest): Promise<{ data: { client: ClientResponse } }> {
    return api.post(baseURL, request);
  }

  getDetails(id: number): Promise<{ data: { client: ClientDetailsResponse } }> {
    return api.get(`${baseURL}/${id}`);
  }

  update(
    request: ClientRequest,
    id: number
  ): Promise<{ data: { client: ClientResponse } }> {
    return api.patch(`${baseURL}/${id}`, request);
  }

  destroy(id: number): Promise<void> {
    return api.delete(`${baseURL}/${id}`);
  }
}
