import { Card, CardContent } from "@/components/ui/card";
export function MetricCard({ title, value, icon: Icon, colorClass, isLoading }) {
    return (<Card className="hover-elevate" data-testid={`card-metric-${title.toLowerCase().replace(' ', '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            {isLoading ? (<div className="h-12 w-20 bg-muted animate-pulse rounded"/>) : (<p className={`text-5xl font-bold ${colorClass}`} data-testid={`text-${title.toLowerCase().replace(' ', '-')}-count`}>
                {value}
              </p>)}
          </div>
          <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${colorClass}`}/>
          </div>
        </div>
      </CardContent>
    </Card>);
}
