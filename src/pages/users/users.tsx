import LoadingAnimation from "@/components/shared/loading-animation";
import TableFilter from "@/components/shared/table-filter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import UserTableRow from "./components/users-table-row";
import { UserResponse } from "@/models/responses/user-response";
import { userApi } from "@/api";
import { toast } from "sonner";
import Pagination from "@/components/shared/pagination";
import { MetaProps } from "@/models/responses/meta-response";

export default function UserList() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [meta, setMeta] = useState<MetaProps | null>();

  const getUsers = async (page = 1) => {
    setLoading(true);
    const userRequest = {
      page: 1,
      perPage: 20,
      searchTerm: "",
    };

    await userApi
      .get(userRequest)
      .then((response) => {
        let meta: MetaProps = {
          lastPage: response.data.lastPage,
          page: Number(response.data.page),
          perPage: Number(response.data.perPage),
          total: response.data.total,
        };
        setUsers(response.data.data);
        setMeta(meta);
      })
      .catch(() => {
        toast.error("Erro ao buscar clientes");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const destroyUser = (user: UserResponse) => {
    console.log(user);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Helmet title="Usuários" />
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tighter">
            Usuários Cadastrados
          </h1>
          <Button className="h-8" asChild disabled={loading}>
            <Link to="/users/create">Novo Usuário</Link>
          </Button>
        </div>

        <div className="space-y-2.5">
          <TableFilter
            disabled={users.length === 0}
            description="Nome do usuário"
            onClearFilter={() => {}}
            onSubmitFilter={() => {}}
          />

          <div className="rounded-md border">
            {loading ? (
              <LoadingAnimation />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead className="w-[140px]">Cargo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    return (
                      <UserTableRow
                        user={user}
                        key={user.id}
                        destroyUser={() => destroyUser(user)}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
          {meta && users.length > 0 && (
            <Pagination
              pageIndex={meta.page}
              totalCount={meta.total}
              perPage={meta.perPage}
              meta={meta}
              getData={getUsers}
            />
          )}
          {users.length === 0 && (
            <div className="w-full py-8 flex justify-center">
              <span className="text-zinc-600">Sem usuários cadastrados</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
