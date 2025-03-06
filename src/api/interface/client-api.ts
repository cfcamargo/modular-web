import { ClientRequest } from "@/models/requests/client-request";
import { ClientResponse } from "@/models/responses/client-response";
import { MetaProps } from "@/models/responses/meta-response";

export abstract class IClientApi {
  abstract get(page: number): Promise<{
    data: {
      clients: {
        meta: MetaProps;
        data: ClientResponse[];
      };
    };
  }>;

  abstract getDetails(id: number): Promise<{
    data: {
      client: ClientResponse;
    };
  }>;

  abstract save(
    request: ClientRequest
  ): Promise<{ data: { client: ClientResponse } }>;

  abstract update(
    request: ClientRequest,
    id: number
  ): Promise<{ data: { client: ClientResponse } }>;

  abstract destroy(id: number): Promise<void>;
}
