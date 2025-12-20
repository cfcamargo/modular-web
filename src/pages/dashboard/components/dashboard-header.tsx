import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Importando Tabs
import { cn } from "@/lib/utils";
import { FilterTypeEnum } from "@/utils/utilsDate";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "../types";

interface DashboardHeaderProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  viewType: FilterTypeEnum;
  onViewTypeChange: (type: FilterTypeEnum) => void;
}

export function DashboardHeader({
  dateRange,
  onDateRangeChange,
  viewType,
  onViewTypeChange,
}: DashboardHeaderProps) {
  const handleTabChange = (value: FilterTypeEnum) => {
    onViewTypeChange(value);
  };

  return (
    <div className="border-b bg-card">
      <div className="mx-auto p-4">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visão geral das vendas e movimentações
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
            <Tabs
              value={viewType}
              onValueChange={(value) =>
                handleTabChange(value as FilterTypeEnum)
              }
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-5 sm:w-auto">
                <TabsTrigger value={FilterTypeEnum.DAY}>Hoje</TabsTrigger>
                <TabsTrigger value={FilterTypeEnum.WEEK}>Semana</TabsTrigger>
                <TabsTrigger value={FilterTypeEnum.MONTH}>Mês</TabsTrigger>
                <TabsTrigger value={FilterTypeEnum.YEAR}>Ano</TabsTrigger>
                <TabsTrigger value={FilterTypeEnum.CUSTOM}>
                  Personalizado
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[260px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground",
                    viewType === "custom" &&
                      "border-primary ring-1 ring-primary",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    "Selecionar período"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    onViewTypeChange(FilterTypeEnum.CUSTOM);
                    onDateRangeChange(range);
                  }}
                  numberOfMonths={2}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
