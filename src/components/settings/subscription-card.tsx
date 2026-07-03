"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Loader2, Radio, Zap, Workflow, Users } from "lucide-react";
import { useState, useEffect } from "react";

const MENU_ICONS: Record<string, typeof Radio> = {
  Broadcasts: Radio,
  Automations: Zap,
  Flows: Workflow,
};

export function SubscriptionCard() {
  const { profile, profileLoading } = useAuth();
  const [contactCount, setContactCount] = useState<number | null>(null);

  useEffect(() => {
    if (!profile) return;
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'select', table: 'contacts', limit: 1, count: true }),
    })
      .then(r => r.json())
      .then(json => setContactCount(json.count ?? 0))
      .catch(() => setContactCount(0));
  }, [profile]);

  if (profileLoading) {
    return (
      <Card className="bg-slate-900/40 border-slate-800">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  const sub = profile?.subscription;
  const endsAt = profile?.subscription_ends_at;
  const limit = profile?.contact_limit ?? 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);
  };

  const isExpired = endsAt ? new Date(endsAt) < new Date() : false;

  const usagePercent = limit > 0 && contactCount !== null
    ? Math.min(Math.round((contactCount / limit) * 100), 100)
    : 0;

  const isNearLimit = limit > 0 && contactCount !== null && contactCount >= limit * 0.8;

  if (!sub) {
    return (
      <Card className="bg-slate-900/40 border-slate-800">
        <CardContent className="py-12 text-center">
          <CreditCard className="mx-auto mb-4 h-12 w-12 text-slate-600" />
          <p className="text-slate-400">No active subscription.</p>
          <p className="mt-1 text-sm text-slate-500">
            Contact your administrator to get a plan.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/40 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{sub.name}</CardTitle>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isExpired
                ? "bg-red-500/10 text-red-400"
                : "bg-green-500/10 text-green-400"
            }`}
          >
            {isExpired ? "Expired" : "Active"}
          </span>
        </div>
        {sub.description && (
          <p className="text-sm text-slate-400 mt-1">{sub.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">
            {formatPrice(sub.price)}
          </span>
          <span className="text-sm text-slate-400">
            / {sub.duration_days} days
          </span>
        </div>

        {endsAt && (
          <div className="text-sm text-slate-400">
            {isExpired ? "Expired" : "Valid until"}:{" "}
            <span className="text-slate-300">
              {new Date(endsAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Users className="h-4 w-4" />
            {limit > 0 ? (
              <span>
                <span className="text-slate-300 font-medium">
                  {contactCount !== null ? contactCount.toLocaleString() : "..."}
                </span>
                {" / "}
                <span className="text-slate-300 font-medium">
                  {limit.toLocaleString()}
                </span>{" "}
                contacts used
              </span>
            ) : (
              <span>
                <span className="text-slate-300 font-medium">
                  {contactCount !== null ? contactCount.toLocaleString() : "..."}
                </span>{" "}
                contacts
              </span>
            )}
          </div>
          {limit > 0 && contactCount !== null && (
            <div className="h-2 w-full rounded-full bg-slate-800">
              <div
                className={`h-2 rounded-full transition-all ${
                  isNearLimit
                    ? "bg-amber-500"
                    : "bg-primary"
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          )}
        </div>

        {Array.isArray(sub.features) && sub.features.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <p className="text-sm font-medium text-slate-300">Sidebar menu access:</p>
            <div className="flex flex-wrap gap-1.5">
              {sub.features.map((feature, i) => {
                const Icon = MENU_ICONS[feature];
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {Icon ? <Icon className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                    {feature}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
