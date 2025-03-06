import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { MetaProps } from "@/models/responses/meta-response";

interface PaginationProps {
  readonly pageIndex: number;
  readonly totalCount: number;
  readonly perPage: number;
  readonly meta: MetaProps;
  readonly getData: (page: number) => void;
}

export default function Pagination({
  pageIndex,
  perPage,
  totalCount,
  getData,
  meta,
}: PaginationProps) {
  const pages = Math.ceil(totalCount / perPage) || 1;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Total de {totalCount} item(s)
      </span>

      <div className="flex items-center gap-6 lg:gap-7">
        <div className="flex text-sm font-medium">
          Página {pageIndex} de {pages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => getData(meta.firstPage)}
            disabled={meta.currentPage === meta.firstPage}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">Primeira página</span>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={meta.currentPage === 1}
            onClick={() => getData(meta.currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página Anterior</span>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={meta.currentPage === meta.lastPage}
            onClick={() => getData(meta.currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Póxima página</span>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={meta.currentPage === meta.lastPage}
            onClick={() => getData(meta.lastPage)}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
