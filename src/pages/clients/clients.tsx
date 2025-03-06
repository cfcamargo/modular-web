import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Helmet } from "react-helmet-async";
import ClientTableFilters from "./components/client-table-filters";
import ClientTableRow from "./components/client-table-row";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClientResponse } from "@/models/responses/client-response";
import { clientApi } from "@/api";
import { toast } from "sonner";
import { MetaProps } from "@/models/responses/meta-response";
import LoadingAnimation from "@/components/shared/loading-animation";
import Pagination from "@/components/shared/pagination";

export default function Clients() {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [meta, setMeta] = useState<MetaProps | null>();
  const [loading, setLoading] = useState(false);

  const getClients = async (page = 1) => {
    setLoading(true);
    await clientApi
      .get(page)
      .then((response) => {
        setClients(response.data.clients.data);
        setMeta(response.data.clients.meta);
      })
      .catch((e) => {
        toast.error("Erro ao buscar clientes");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const destroyClient = async (client: ClientResponse) => {
    clientApi
      .destroy(client.id)
      .then(() => {
        getClients();
        toast.success(`O cliente ${client.fullName} foi deletado com sucesso`);
      })
      .catch((e) => {
        toast.error("Erro ao deletar cliente");
      });
  };

  useEffect(() => {
    getClients();
  }, []);

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
          <ClientTableFilters disabled={clients.length === 0} />

          <div className="rounded-md border">
            {loading ? (
              <LoadingAnimation />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">ID</TableHead>
                    <TableHead>Nome do cliente</TableHead>
                    <TableHead className="w-[140px]">CPF</TableHead>
                    <TableHead>RG</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
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
              pageIndex={meta.currentPage}
              totalCount={meta.total}
              perPage={meta.perPage}
              meta={meta}
              getData={getClients}
            />
          )}
          {clients.length === 0 && (
            <div className="w-full py-8 flex justify-center">
              <span className="text-zinc-600">Sem clientes cadastrados</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
