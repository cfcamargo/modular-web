import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Helmet } from "react-helmet-async";
import ClientTableRow from "./components/client-table-row";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { ClientResponse } from "@/models/responses/client-response";
import { clientApi } from "@/api";
import { toast } from "sonner";
import { MetaProps } from "@/models/responses/meta-response";
import LoadingAnimation from "@/components/shared/loading-animation";
import Pagination from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { GetClientsRequest } from "@/models/requests/client-request";

export default function Clients() {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [meta, setMeta] = useState<MetaProps | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Função principal de busca
  const getClients = useCallback(async (page = 1, searchTerm?: string) => {
    console.log("Search Term:", searchTerm); // Agora isso só vai aparecer quando realmente mudar
    setLoading(true);
    const params: GetClientsRequest = {
      page,
      perPage: 20,
      searchTerm,
    };

    await clientApi
      .get(params)
      .then((response) => {
        setClients(response.data.clients);
        setMeta(response.data.meta);
      })
      .catch(() => {
        toast.error("Erro ao buscar clientes");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = useCallback(
    (term: string) => {
      getClients(1, term);
    },
    [getClients]
  );

  const destroyClient = async (client: ClientResponse) => {
    clientApi
      .destroy(String(client.id))
      .then(() => {
        getClients(meta?.page || 1);
        toast.success(`O cliente ${client.name} foi deletado com sucesso`);
      })
      .catch(() => {
        toast.error("Erro ao deletar cliente");
      });
  };

  useEffect(() => {
    getClients();
  }, [getClients]);

  return (
    <>
      <Helmet title="Clientes" />
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tighter">Clientes</h1>
          <Button className="h-8" asChild disabled={loading}>
            <Link to="/clients/create">Novo Cliente</Link>
          </Button>
        </div>

        <div className="space-y-2.5">
          <SearchInput onSearch={handleSearch} />

          <div className="rounded-md border">
            {loading ? (
              <LoadingAnimation />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do cliente</TableHead>
                    <TableHead className="w-[140px]">CPF</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => {
                    return (
                      <ClientTableRow
                        client={client}
                        key={client.id}
                        destroyClient={() => destroyClient(client)}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>

          {meta && clients.length > 0 && (
            <Pagination
              pageIndex={meta.page}
              totalCount={meta.total}
              perPage={meta.perPage}
              meta={meta}
              getData={getClients}
            />
          )}

          {!loading && clients.length === 0 && (
            <div className="w-full py-8 flex justify-center">
              <span className="text-zinc-600">Sem clientes cadastrados</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
