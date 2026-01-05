import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function OrderFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" /> {/* Título */}
          <Skeleton className="h-4 w-96" /> {/* Subtítulo */}
        </div>
        <Skeleton className="h-10 w-32" /> {/* Botão de Imprimir */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- COLUNA ESQUERDA (PRINCIPAL) --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Dados do Cliente */}
          <Card>
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" /> {/* Label */}
                  <Skeleton className="h-10 w-full" /> {/* Input/Combobox */}
                </div>
                {/* Resumo do Cliente Selecionado */}
                <div className="flex gap-4 p-4 border rounded-md bg-muted/10">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Itens do Pedido */}
          <Card>
            <CardHeader className="pb-4 flex flex-row justify-between items-center">
              <div className="space-y-1">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-9 w-32" /> {/* Botão Adicionar */}
            </CardHeader>
            <CardContent>
              {/* Tabela Fake */}
              <div className="border rounded-md">
                {/* Header da Tabela */}
                <div className="flex p-4 border-b bg-muted/5 gap-4">
                  <Skeleton className="h-4 w-1/2" /> {/* Produto */}
                  <Skeleton className="h-4 w-20" /> {/* Qtd */}
                  <Skeleton className="h-4 w-24" /> {/* Preço */}
                  <Skeleton className="h-4 w-24" /> {/* Total */}
                  <Skeleton className="h-4 w-8" /> {/* Ações */}
                </div>
                {/* Linhas da Tabela (x3) */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex p-4 border-b last:border-0 gap-4 items-center"
                  >
                    <Skeleton className="h-10 flex-1" /> {/* Select Produto */}
                    <Skeleton className="h-10 w-20" /> {/* Input Qtd */}
                    <Skeleton className="h-10 w-24" /> {/* Input Preço */}
                    <Skeleton className="h-8 w-24" /> {/* Texto Total */}
                    <Skeleton className="h-8 w-8 rounded-md" />{" "}
                    {/* Botão Lixeira */}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-end py-4 bg-muted/5">
              <Skeleton className="h-6 w-48" /> {/* Total dos Itens */}
            </CardFooter>
          </Card>

          {/* Card: Entrega */}
          <Card>
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border p-4 rounded-md">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" /> {/* Switch */}
              </div>
              {/* Área de Endereço (Simulando estar aberto) */}
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-20 w-full" /> {/* Textarea */}
                </div>
                <div className="space-y-2 w-1/3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" /> {/* Input Frete */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- COLUNA DIREITA (RESUMO) --- */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campo Desconto */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              <Separator />

              {/* Linhas de Totais */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Separator />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-6 w-24" /> {/* Label Total */}
                  <Skeleton className="h-8 w-32" /> {/* Valor Total Grande */}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-3 pt-4">
                <Skeleton className="h-12 w-full rounded-md" />{" "}
                {/* Gerar Pedido */}
                <Skeleton className="h-10 w-full rounded-md" />{" "}
                {/* Salvar Rascunho */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
