import { useCallback, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { User, FileText, Trash, Edit, Briefcase } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { clientApi } from "@/api";
import LoadingAnimation from "@/components/shared/loading-animation";
import Pagination from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import ClientTableRow from "./components/client-table-row";

import { ClientResponse } from "@/models/responses/client-response";
import { MetaProps } from "@/models/responses/meta-response";
import { GetClientsRequest } from "@/models/requests/client-request";

export default function Clients() {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [meta, setMeta] = useState<MetaProps | null>(null);
  const [loading, setLoading] = useState(false);

  const getClients = useCallback(async (page = 1, searchTerm?: string) => {
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
      <div className="flex flex-col gap-4 pb-20 md:pb-0">
        <div className="w-full flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">
            Clientes
          </h1>
          <div className="flex gap-2 w-full xs:w-auto">
            <Button
              className="h-10 xs:h-9 w-full xs:w-auto"
              asChild
              disabled={loading}
            >
              <Link to="/clients/create">Novo Cliente</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-2.5">
          <SearchInput onSearch={handleSearch} />

          <div className="rounded-md border-none md:border">
            {loading ? (
              <div className="w-full h-40 flex justify-center items-center">
                <LoadingAnimation />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {clients.map((client) => (
                    <NavLink to={`/clients/${client.id}`}>
                      <Card
                        key={client.id}
                        className="shadow-sm border-l-4 border-l-primary/20"
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-muted rounded-full">
                                <User className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg leading-tight">
                                  {client.name}
                                </h3>
                                {client.type && (
                                  <Badge
                                    variant="secondary"
                                    className="mt-1 text-xs"
                                  >
                                    {client.type}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2 pb-3 space-y-3">
                          <div className="flex items-center justify-between text-sm bg-muted/20 p-2 rounded">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              <FileText className="w-4 h-4" /> Documento
                              (CPF/CNPJ):
                            </span>
                            <span className="font-mono font-medium">
                              {client.document || "Não informado"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </NavLink>
                  ))}
                </div>

                <div className="hidden md:block border rounded-md ">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome do cliente</TableHead>
                        <TableHead className="w-[180px]">Documento</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="w-[140px] text-right">
                          Ações
                        </TableHead>
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
                </div>
              </>
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
            <div className="w-full py-8 flex justify-center border rounded-lg border-dashed bg-muted/10">
              <span className="text-zinc-600 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Sem clientes cadastrados
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
