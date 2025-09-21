import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Plus, BarChart } from "lucide-react";

export default function QuoteList() {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Sistema de Orçamentos</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gerencie seus orçamentos de forma simples e profissional
          </p>

          <Link to="/quotes/create">
            <Button size="lg" className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Criar Novo Orçamento
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Orçamentos
              </CardTitle>
              <CardDescription>
                Crie e gerencie orçamentos para seus clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/quotes/new">
                <Button variant="outline" className="w-full">
                  Novo Orçamento
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Relatórios
              </CardTitle>
              <CardDescription>
                Acompanhe o desempenho dos seus orçamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Em Breve
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Configurações
              </CardTitle>
              <CardDescription>
                Gerencie clientes, produtos e configurações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Em Breve
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
