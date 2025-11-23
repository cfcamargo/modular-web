import { api } from "@/lib/axios";
import {
  ClientRequest,
  GetClientsRequest,
} from "@/models/requests/client-request";
import { ClientResponse } from "@/models/responses/client-response";
import { MetaProps } from "@/models/responses/meta-response";

const baseURL = "/clients";
export class ClientApi {
  get(params: GetClientsRequest): Promise<{
    data: {
      clients: ClientResponse[];
      meta: MetaProps;
    };
  }> {
    return api.get(`${baseURL}`, {
      params,
    });
  }
  save(request: ClientRequest): Promise<{ data: { clients: ClientResponse } }> {
    return api.post(baseURL, request);
  }

  getDetails(id: string): Promise<{ data: ClientResponse }> {
    return api.get(`${baseURL}/${id}`);
  }

  update(
    request: ClientRequest,
    id: string
  ): Promise<{ data: { client: ClientResponse } }> {
    return api.patch(`${baseURL}/${id}`, request);
  }

  destroy(id: string): Promise<void> {
    return api.delete(`${baseURL}/${id}`);
  }
}
