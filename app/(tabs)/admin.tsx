import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Platform,
  ActivityIndicator,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { API, apiGetJson } from "../../lib/apiClient";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);

type TabId = "dashboard" | "users" | "accounting" | "flow" | "analytics" | "sessions";
type UserItem = { id: number; email: string; role: string; is_premium: boolean; email_verified: boolean; created_at: string | null };
type DashData = {
  users: { total: number; premium: number; admin: number; verified: number; active_24h: number; new_24h: number; new_7d: number };
  events: { total: number; last_24h: number; last_7d: number; vip_clicks: number; vip_unlocks: number; top_domains: { name: string; count: number }[]; top_actions: { name: string; count: number }[] };
  yanki: { pending: number; published: number; rejected: number };
  memories: { total: number };
  recent_events: any[];
};
type AccountingData = {
  summary: { sales_today_count: number; revenue_today: number; sales_month_count: number; revenue_month: number; pending_collection_count: number; pending_collection_amount: number; top_product: { label: string; revenue: number; count: number } | null; avg_basket_month: number; collected_revenue_all_time: number };
  orders: any[];
  orders_total: number;
  by_product: { content_id: string; display_name: string; sale_count: number; total_revenue: number }[];
  customer_emails: string[];
};
type AnalyticsData = {
  daily_events: { day: string; count: number }[];
  daily_users: { day: string; count: number }[];
  by_action: { name: string; count: number }[];
  by_domain: { name: string; count: number }[];
  event_counts: Record<string, number>;
};
type MembershipData = {
  total_users: number; premium: number; free: number; new_premium_7d: number; new_premium_30d: number;
  vip_clicks: number; vip_unlocks: number; purchases: number; failed_purchases: number; conversion_rate: number;
};
type SessionData = {
  period: string; total_sessions: number; unique_session_users: number;
  avg_session_duration_sec: number; avg_session_duration_min: number;
  dau: { day: string; count: number }[];
  sessions_daily: { day: string; count: number }[];
  screen_time: { screen: string; visits: number; total_sec: number; avg_sec: number }[];
  top_screens: { screen: string; views: number }[];
  hourly_distribution: { hour: number; count: number }[];
};
type RetentionData = {
  retention: { day: number; label: string; cohort_size: number; returned: number; rate_pct: number }[];
  weekly_cohorts: { week_ago: number; label: string; new_users: number }[];
  churn_14d_inactive: number;
};
type FlowItem = { id: string; type: string; title: string; text: string; time: string | null; read: boolean };

const TABS: { id: TabId; label: string }[] = [
  { id: "dashboard", label: "Genel" },
  { id: "users", label: "Üyeler" },
  { id: "accounting", label: "Muhasebe" },
  { id: "sessions", label: "Oturumlar" },
  { id: "flow", label: "Akış" },
  { id: "analytics", label: "Analitik" },
];

function fmtDate(d: string | null) {
  if (!d) return "—";
  try { const dt = new Date(d); return `${dt.getDate().toString().padStart(2, "0")}.${(dt.getMonth() + 1).toString().padStart(2, "0")}.${dt.getFullYear()}`; }
  catch { return d; }
}
function fmtTime(d: string | null) {
  if (!d) return "";
  try { const dt = new Date(d); return `${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`; }
  catch { return ""; }
}
function fmtMoney(n: number) { return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺"; }

export default function AdminScreen() {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState<TabId>("dashboard");
  const [refreshing, setRefreshing] = useState(false);

  // Dashboard
  const [dash, setDash] = useState<DashData | null>(null);
  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [dashLoading, setDashLoading] = useState(true);

  // Users
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [copied, setCopied] = useState("");

  // Accounting
  const [acct, setAcct] = useState<AccountingData | null>(null);
  const [acctLoading, setAcctLoading] = useState(false);

  // Flow
  const [flow, setFlow] = useState<FlowItem[]>([]);
  const [flowLoading, setFlowLoading] = useState(false);

  // Sessions
  const [sess, setSess] = useState<SessionData | null>(null);
  const [ret, setRet] = useState<RetentionData | null>(null);
  const [sessPeriod, setSessPeriod] = useState("7d");
  const [sessLoading, setSessLoading] = useState(false);

  // Analytics
  const [anl, setAnl] = useState<AnalyticsData | null>(null);
  const [anlPeriod, setAnlPeriod] = useState("7d");
  const [anlLoading, setAnlLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) { router.replace("/(tabs)/gates"); return; }
    loadDashboard();
  }, [isAdmin]);

  useEffect(() => {
    if (tab === "users" && users.length === 0) loadUsers();
    if (tab === "accounting" && !acct) loadAccounting();
    if (tab === "sessions" && !sess) loadSessions(sessPeriod);
    if (tab === "flow" && flow.length === 0) loadFlow();
    if (tab === "analytics" && !anl) loadAnalytics(anlPeriod);
  }, [tab]);

  const loadDashboard = async () => {
    setDashLoading(true);
    try {
      const [d, m] = await Promise.all([
        apiGetJson(`${API.base}/admin/dashboard`, 20000),
        apiGetJson(`${API.base}/admin/membership`, 20000),
      ]);
      setDash(d);
      setMembership(m);
    } catch (e) { if (__DEV__) console.log("dash err:", e); }
    finally { setDashLoading(false); }
  };

  const loadUsers = async (search?: string) => {
    setUsersLoading(true);
    try {
      const q = search?.trim() || "";
      const data = await apiGetJson(`${API.base}/admin/users-list?limit=200${q ? `&search=${encodeURIComponent(q)}` : ""}`, 20000);
      setUsers(data?.items || []);
      setUsersTotal(data?.total ?? 0);
    } catch (e) { if (__DEV__) console.log("users err:", e); }
    finally { setUsersLoading(false); }
  };

  const loadAccounting = async () => {
    setAcctLoading(true);
    try {
      const data = await apiGetJson(`${API.base}/admin/accounting`, 25000);
      setAcct(data);
    } catch (e) { if (__DEV__) console.log("acct err:", e); }
    finally { setAcctLoading(false); }
  };

  const loadFlow = async () => {
    setFlowLoading(true);
    try {
      const data = await apiGetJson(`${API.base}/admin/notifications-feed?limit=80`, 20000);
      setFlow(data?.items || []);
    } catch (e) { if (__DEV__) console.log("flow err:", e); }
    finally { setFlowLoading(false); }
  };

  const loadSessions = async (period: string) => {
    setSessLoading(true);
    try {
      const [sData, rData] = await Promise.all([
        apiGetJson(`${API.base}/admin/session-stats?period=${period}`, 20000),
        apiGetJson(`${API.base}/admin/retention`, 20000),
      ]);
      setSess(sData);
      setRet(rData);
    } catch (e) { if (__DEV__) console.log("sess err:", e); }
    finally { setSessLoading(false); }
  };

  const loadAnalytics = async (period: string) => {
    setAnlLoading(true);
    try {
      const data = await apiGetJson(`${API.base}/admin/analytics?period=${period}`, 20000);
      setAnl(data);
    } catch (e) { if (__DEV__) console.log("anl err:", e); }
    finally { setAnlLoading(false); }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (tab === "dashboard") await loadDashboard();
    else if (tab === "users") await loadUsers(searchQ);
    else if (tab === "accounting") await loadAccounting();
    else if (tab === "sessions") await loadSessions(sessPeriod);
    else if (tab === "flow") await loadFlow();
    else if (tab === "analytics") await loadAnalytics(anlPeriod);
    setRefreshing(false);
  }, [tab, searchQ, anlPeriod]);

  const copyText = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    } catch { Alert.alert("Hata", "Kopyalanamadı."); }
  };

  if (!isAdmin) return null;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />

      <View style={s.topbar}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)/gates")} style={s.backBtn} hitSlop={10}>
          <Text style={s.backTxt}>← Kapılar</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={s.adminBadge}>ADMIN</Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabBar}>
        {TABS.map((t) => (
          <Pressable key={t.id} onPress={() => setTab(t.id)} style={[s.tabItem, tab === t.id && s.tabActive]}>
            <Text style={[s.tabText, tab === t.id && s.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7cf7d8" />}
      >
        {/* ══════ DASHBOARD ══════ */}
        {tab === "dashboard" && (
          dashLoading ? <Loader /> : dash ? (
            <>
              <SectionHead title="Kullanıcılar" />
              <Row>
                <Stat label="Toplam" value={String(dash.users.total)} color="#cbbcff" />
                <Stat label="VIP" value={String(dash.users.premium)} color="#7cf7d8" />
                <Stat label="Aktif 24s" value={String(dash.users.active_24h)} color="#fff" />
              </Row>
              <Row>
                <Stat label="Yeni 24s" value={String(dash.users.new_24h)} color="#fcd34d" />
                <Stat label="Yeni 7g" value={String(dash.users.new_7d)} color="#fcd34d" />
                <Stat label="Doğrulanmış" value={String(dash.users.verified)} color="#7cf7d8" />
              </Row>

              <SectionHead title="Gelir & Dönüşüm" />
              {membership && (
                <>
                  <Row>
                    <Stat label="VIP Tıklama" value={String(membership.vip_clicks)} color="#ff6b6b" />
                    <Stat label="VIP Açılma" value={String(membership.vip_unlocks)} color="#7cf7d8" />
                    <Stat label="Dönüşüm" value={`%${membership.conversion_rate}`} color="#fcd34d" />
                  </Row>
                  <Row>
                    <Stat label="Satın Alma" value={String(membership.purchases)} color="#7cf7d8" />
                    <Stat label="Başarısız" value={String(membership.failed_purchases)} color="#ff6b6b" />
                    <Stat label="Yeni VIP 7g" value={String(membership.new_premium_7d)} color="#cbbcff" />
                  </Row>
                </>
              )}

              <SectionHead title="Eventler" />
              <Row>
                <Stat label="Toplam" value={String(dash.events.total)} color="#cbbcff" />
                <Stat label="24 Saat" value={String(dash.events.last_24h)} color="#7cf7d8" />
                <Stat label="7 Gün" value={String(dash.events.last_7d)} color="#fff" />
              </Row>

              {dash.events.top_actions.length > 0 && (
                <Section title="En Çok Eylem (7g)">
                  {dash.events.top_actions.slice(0, 8).map((a) => (
                    <ListRow key={a.name} label={a.name} value={String(a.count)} />
                  ))}
                </Section>
              )}

              {dash.events.top_domains.length > 0 && (
                <Section title="Alan Dağılımı (7g)">
                  {dash.events.top_domains.map((d) => (
                    <ListRow key={d.name} label={d.name} value={String(d.count)} />
                  ))}
                </Section>
              )}

              <SectionHead title="Yankı Moderasyon" />
              <Row>
                <Stat label="Bekleyen" value={String(dash.yanki.pending)} color="#fcd34d" />
                <Stat label="Yayında" value={String(dash.yanki.published)} color="#7cf7d8" />
                <Stat label="Reddedilen" value={String(dash.yanki.rejected)} color="#ff6b6b" />
              </Row>

              <Section title="Son Eventler">
                {dash.recent_events.slice(0, 10).map((e: any) => (
                  <View key={e.id} style={s.eventRow}>
                    <Text style={s.eventAction}>{e.action}</Text>
                    <Text style={s.eventMeta}>{e.domain} • {fmtTime(e.created_at)}</Text>
                  </View>
                ))}
              </Section>
            </>
          ) : <Empty text="Dashboard yüklenemedi." />
        )}

        {/* ══════ USERS ══════ */}
        {tab === "users" && (
          <>
            <View style={s.searchRow}>
              <TextInput value={searchQ} onChangeText={setSearchQ} placeholder="Email ara..." placeholderTextColor="rgba(255,255,255,0.30)" style={s.searchInput} autoCapitalize="none" keyboardType="email-address" onSubmitEditing={() => loadUsers(searchQ)} returnKeyType="search" />
              <Pressable onPress={() => loadUsers(searchQ)} style={s.searchBtn}><Text style={s.searchBtnTxt}>Ara</Text></Pressable>
            </View>

            <View style={s.actionRow}>
              <Text style={s.metaText}>{usersTotal} kullanıcı</Text>
              <Pressable onPress={() => copyText(users.map((u) => u.email).join("\n"), "emails")} style={s.copyBtn}>
                <Text style={s.copyBtnTxt}>{copied === "emails" ? "✓ Kopyalandı!" : "Tüm E-postaları Kopyala"}</Text>
              </Pressable>
            </View>

            {usersLoading ? <Loader /> : users.length === 0 ? <Empty text="Kullanıcı bulunamadı." /> : users.map((u) => (
              <Pressable key={u.id} onPress={() => copyText(u.email, `u-${u.id}`)} style={s.userCard}>
                <View style={s.userTop}>
                  <Text style={s.userEmail} numberOfLines={1}>{u.email}</Text>
                  <View style={s.badgeRow}>
                    {u.role === "admin" && <Badge text="ADMIN" color="#ff6b6b" />}
                    {u.is_premium && <Badge text="VIP" color="#7cf7d8" />}
                    {u.email_verified && <Badge text="✓" color="#cbbcff" />}
                  </View>
                </View>
                <Text style={s.userMeta}>ID: {u.id}  •  {u.role}  •  {fmtDate(u.created_at)}{copied === `u-${u.id}` ? "  ✓" : ""}</Text>
              </Pressable>
            ))}
          </>
        )}

        {/* ══════ ACCOUNTING ══════ */}
        {tab === "accounting" && (
          acctLoading ? <Loader /> : acct ? (
            <>
              <SectionHead title="Bugün" />
              <Row>
                <Stat label="Satış" value={String(acct.summary.sales_today_count)} color="#7cf7d8" />
                <Stat label="Gelir" value={fmtMoney(acct.summary.revenue_today)} color="#fcd34d" />
              </Row>

              <SectionHead title="Bu Ay" />
              <Row>
                <Stat label="Satış" value={String(acct.summary.sales_month_count)} color="#7cf7d8" />
                <Stat label="Gelir" value={fmtMoney(acct.summary.revenue_month)} color="#fcd34d" />
              </Row>
              <Row>
                <Stat label="Ort. Sepet" value={fmtMoney(acct.summary.avg_basket_month)} color="#cbbcff" />
                <Stat label="Toplam Tahsilat" value={fmtMoney(acct.summary.collected_revenue_all_time)} color="#7cf7d8" />
              </Row>

              {acct.summary.top_product && (
                <View style={s.highlightCard}>
                  <Text style={s.highlightLabel}>En Çok Satan Ürün</Text>
                  <Text style={s.highlightValue}>{acct.summary.top_product.label}</Text>
                  <Text style={s.highlightSub}>{acct.summary.top_product.count} satış • {fmtMoney(acct.summary.top_product.revenue)}</Text>
                </View>
              )}

              <Row>
                <Stat label="Bekleyen" value={String(acct.summary.pending_collection_count)} color="#ff6b6b" />
                <Stat label="Bekleyen Tutar" value={fmtMoney(acct.summary.pending_collection_amount)} color="#ff6b6b" />
              </Row>

              {acct.by_product.length > 0 && (
                <Section title="Ürün Bazlı Gelir">
                  {acct.by_product.map((p) => (
                    <View key={p.content_id} style={s.listRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.listLabel}>{p.display_name}</Text>
                        <Text style={s.listSub}>{p.sale_count} satış</Text>
                      </View>
                      <Text style={s.listValue}>{fmtMoney(p.total_revenue)}</Text>
                    </View>
                  ))}
                </Section>
              )}

              {acct.customer_emails.length > 0 && (
                <Section title={`Müşteri E-postaları (${acct.customer_emails.length})`}>
                  <Pressable onPress={() => copyText(acct.customer_emails.join("\n"), "cust-emails")} style={[s.copyBtn, { marginBottom: 10, alignSelf: "flex-start" }]}>
                    <Text style={s.copyBtnTxt}>{copied === "cust-emails" ? "✓ Kopyalandı!" : "Tümünü Kopyala"}</Text>
                  </Pressable>
                  {acct.customer_emails.slice(0, 30).map((e) => (
                    <Pressable key={e} onPress={() => copyText(e, e)}>
                      <Text style={[s.emailRow, copied === e && { color: "#7cf7d8" }]}>{e}{copied === e ? " ✓" : ""}</Text>
                    </Pressable>
                  ))}
                  {acct.customer_emails.length > 30 && <Text style={s.metaText}>+{acct.customer_emails.length - 30} daha...</Text>}
                </Section>
              )}

              {acct.orders.length > 0 && (
                <Section title={`Son Siparişler (${acct.orders_total})`}>
                  {acct.orders.slice(0, 20).map((o: any) => (
                    <View key={o.id} style={s.orderRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.orderProduct}>{o.product_name || o.content_id}</Text>
                        <Text style={s.orderEmail}>{o.email}</Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={s.orderAmount}>{fmtMoney(o.amount)}</Text>
                        <Text style={[s.orderStatus, o.status === "completed" ? { color: "#7cf7d8" } : { color: "#fcd34d" }]}>{o.payment_status}</Text>
                      </View>
                    </View>
                  ))}
                </Section>
              )}
            </>
          ) : <Empty text="Muhasebe verileri yüklenemedi." />
        )}

        {/* ══════ SESSIONS ══════ */}
        {tab === "sessions" && (
          <>
            <View style={s.periodRow}>
              {["24h", "7d", "30d", "90d"].map((p) => (
                <Pressable key={p} onPress={() => { setSessPeriod(p); loadSessions(p); }} style={[s.periodChip, sessPeriod === p && s.periodActive]}>
                  <Text style={[s.periodText, sessPeriod === p && s.periodTextActive]}>{p === "24h" ? "24s" : p === "7d" ? "7g" : p === "30d" ? "30g" : "90g"}</Text>
                </Pressable>
              ))}
            </View>

            {sessLoading ? <Loader /> : sess ? (
              <>
                <SectionHead title="Oturum Özeti" />
                <Row>
                  <Stat label="Toplam Oturum" value={String(sess.total_sessions)} color="#7cf7d8" />
                  <Stat label="Tekil Kullanıcı" value={String(sess.unique_session_users)} color="#cbbcff" />
                </Row>
                <Row>
                  <Stat label="Ort. Süre" value={`${sess.avg_session_duration_min} dk`} color="#fcd34d" />
                  <Stat label="Ort. Süre (sn)" value={`${sess.avg_session_duration_sec}s`} color="#fff" />
                </Row>

                {sess.dau.length > 0 && (
                  <Section title="Günlük Aktif Kullanıcı (DAU)">
                    {sess.dau.slice(-14).map((d) => (
                      <ListRow key={d.day} label={fmtDate(d.day)} value={String(d.count)} />
                    ))}
                  </Section>
                )}

                {sess.sessions_daily.length > 0 && (
                  <Section title="Günlük Oturum Sayısı">
                    {sess.sessions_daily.slice(-14).map((d) => (
                      <ListRow key={d.day} label={fmtDate(d.day)} value={String(d.count)} />
                    ))}
                  </Section>
                )}

                {sess.top_screens.length > 0 && (
                  <Section title="En Çok Ziyaret Edilen Ekranlar">
                    {sess.top_screens.map((sc) => (
                      <ListRow key={sc.screen} label={sc.screen} value={`${sc.views} görüntüleme`} />
                    ))}
                  </Section>
                )}

                {sess.screen_time.length > 0 && (
                  <Section title="Ekran Bazlı Süre">
                    {sess.screen_time.map((sc) => (
                      <View key={sc.screen} style={s.listRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={s.listLabel}>{sc.screen}</Text>
                          <Text style={s.listSub}>{sc.visits} ziyaret • ort. {Math.round(sc.avg_sec)}s</Text>
                        </View>
                        <Text style={s.listValue}>{Math.round(sc.total_sec / 60)} dk</Text>
                      </View>
                    ))}
                  </Section>
                )}

                {sess.hourly_distribution.length > 0 && (
                  <Section title="Saatlik Yoğunluk (GMT)">
                    {sess.hourly_distribution.map((h) => (
                      <ListRow key={h.hour} label={`${String(h.hour).padStart(2, "0")}:00`} value={String(h.count)} />
                    ))}
                  </Section>
                )}

                {/* Retention */}
                {ret && (
                  <>
                    <SectionHead title="Retention (Geri Dönüş)" />
                    {ret.retention.map((r) => (
                      <View key={r.day} style={s.listRow}>
                        <Text style={s.listLabel}>{r.label}</Text>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text style={[s.listValue, { color: r.rate_pct >= 20 ? "#7cf7d8" : r.rate_pct >= 10 ? "#fcd34d" : "#ff6b6b" }]}>%{r.rate_pct}</Text>
                          <Text style={s.listSub}>{r.returned}/{r.cohort_size}</Text>
                        </View>
                      </View>
                    ))}

                    <View style={[s.highlightCard, { marginTop: 12 }]}>
                      <Text style={s.highlightLabel}>14 Gün İnaktif (Churn Riski)</Text>
                      <Text style={[s.highlightValue, { color: "#ff6b6b" }]}>{ret.churn_14d_inactive}</Text>
                    </View>

                    {ret.weekly_cohorts.length > 0 && (
                      <Section title="Haftalık Kohort (Yeni Kayıtlar)">
                        {ret.weekly_cohorts.map((wc) => (
                          <ListRow key={wc.week_ago} label={wc.label} value={`${wc.new_users} yeni`} />
                        ))}
                      </Section>
                    )}
                  </>
                )}
              </>
            ) : <Empty text="Oturum verileri yüklenemedi." />}
          </>
        )}

        {/* ══════ FLOW ══════ */}
        {tab === "flow" && (
          flowLoading ? <Loader /> : flow.length === 0 ? <Empty text="Akış boş." /> : (
            <>
              <Text style={s.metaText}>{flow.length} olay</Text>
              {flow.map((f) => (
                <View key={f.id} style={s.flowCard}>
                  <View style={s.flowTop}>
                    <FlowTypeBadge type={f.type} />
                    <Text style={s.flowTitle}>{f.title}</Text>
                    <Text style={s.flowTime}>{fmtTime(f.time)}</Text>
                  </View>
                  <Text style={s.flowText} numberOfLines={2}>{f.text}</Text>
                  {f.time && <Text style={s.flowDate}>{fmtDate(f.time)}</Text>}
                </View>
              ))}
            </>
          )
        )}

        {/* ══════ ANALYTICS ══════ */}
        {tab === "analytics" && (
          <>
            <View style={s.periodRow}>
              {["7d", "30d", "90d"].map((p) => (
                <Pressable key={p} onPress={() => { setAnlPeriod(p); loadAnalytics(p); }} style={[s.periodChip, anlPeriod === p && s.periodActive]}>
                  <Text style={[s.periodText, anlPeriod === p && s.periodTextActive]}>{p === "7d" ? "7 Gün" : p === "30d" ? "30 Gün" : "90 Gün"}</Text>
                </Pressable>
              ))}
            </View>

            {anlLoading ? <Loader /> : anl ? (
              <>
                {anl.event_counts && (
                  <Section title="Olay Sayıları">
                    {Object.entries(anl.event_counts).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                      <ListRow key={k} label={k.replace(/_/g, " ")} value={String(v)} />
                    ))}
                  </Section>
                )}

                {anl.daily_users.length > 0 && (
                  <Section title="Günlük Yeni Kullanıcı">
                    {anl.daily_users.slice(-14).map((d) => (
                      <ListRow key={d.day} label={fmtDate(d.day)} value={String(d.count)} />
                    ))}
                  </Section>
                )}

                {anl.daily_events.length > 0 && (
                  <Section title="Günlük Event">
                    {anl.daily_events.slice(-14).map((d) => (
                      <ListRow key={d.day} label={fmtDate(d.day)} value={String(d.count)} />
                    ))}
                  </Section>
                )}

                {anl.by_action.length > 0 && (
                  <Section title="Eylem Dağılımı">
                    {anl.by_action.slice(0, 15).map((a) => (
                      <ListRow key={a.name} label={a.name} value={String(a.count)} />
                    ))}
                  </Section>
                )}

                {anl.by_domain.length > 0 && (
                  <Section title="Alan Dağılımı">
                    {anl.by_domain.map((d) => (
                      <ListRow key={d.name} label={d.name} value={String(d.count)} />
                    ))}
                  </Section>
                )}
              </>
            ) : <Empty text="Analitik yüklenemedi." />}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

/* ── Reusable Components ── */

function Loader() { return <ActivityIndicator color="#7cf7d8" style={{ marginTop: 40 }} size="large" />; }
function Empty({ text }: { text: string }) { return <Text style={s.empty}>{text}</Text>; }

function SectionHead({ title }: { title: string }) {
  return <Text style={s.sectionHead}>{title}</Text>;
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={s.row}>{children}</View>;
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={s.statCard}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={[s.statValue, { color }]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ListRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.listRow}>
      <Text style={s.listLabel} numberOfLines={1}>{label}</Text>
      <Text style={s.listValue}>{value}</Text>
    </View>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return <Text style={[s.badge, { backgroundColor: color + "20", color }]}>{text}</Text>;
}

function FlowTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = { purchase: "#7cf7d8", system: "#ff6b6b", moderation: "#fcd34d", comment: "#cbbcff" };
  const c = colors[type] || "#888";
  return <View style={[s.flowDot, { backgroundColor: c }]} />;
}

/* ── Styles ── */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  topbar: { paddingTop: SAFE_TOP, paddingHorizontal: 14, paddingBottom: 6, flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
  backTxt: { color: "#7cf7d8", fontWeight: "800" },
  adminBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: "rgba(255,59,59,0.20)", color: "#ff6b6b", fontSize: 11, fontWeight: "900", letterSpacing: 2, overflow: "hidden" },

  tabBar: { paddingHorizontal: 14, gap: 6, paddingBottom: 10 },
  tabItem: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  tabActive: { backgroundColor: "rgba(94,59,255,0.25)", borderColor: "rgba(124,247,216,0.20)" },
  tabText: { color: "rgba(255,255,255,0.50)", fontWeight: "800", fontSize: 13 },
  tabTextActive: { color: "#FFFFFF" },

  content: { paddingHorizontal: 16, paddingTop: 6 },

  sectionHead: { color: "rgba(255,255,255,0.40)", fontSize: 11, fontWeight: "900", letterSpacing: 2, textTransform: "uppercase", marginTop: 18, marginBottom: 8 },

  row: { flexDirection: "row", gap: 8, marginBottom: 8 },
  statCard: { flex: 1, borderRadius: 16, padding: 12, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  statLabel: { color: "rgba(255,255,255,0.50)", fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" },
  statValue: { fontSize: 18, fontWeight: "900" },

  section: { marginTop: 12, borderRadius: 18, padding: 14, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  sectionTitle: { color: "#7cf7d8", fontWeight: "900", fontSize: 14, marginBottom: 10, letterSpacing: 1 },

  listRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" },
  listLabel: { color: "rgba(255,255,255,0.78)", fontWeight: "700", fontSize: 13, flex: 1, marginRight: 10 },
  listSub: { color: "rgba(255,255,255,0.40)", fontSize: 11, marginTop: 2 },
  listValue: { color: "#cbbcff", fontWeight: "900", fontSize: 14 },

  empty: { color: "rgba(255,255,255,0.45)", marginTop: 40, textAlign: "center", fontSize: 15 },
  metaText: { color: "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: "700", marginBottom: 10 },

  /* Users */
  searchRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  searchInput: { flex: 1, height: 44, borderRadius: 14, paddingHorizontal: 14, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)", color: "#FFF", fontSize: 14 },
  searchBtn: { height: 44, paddingHorizontal: 18, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(94,59,255,0.25)", borderWidth: 1, borderColor: "rgba(94,59,255,0.40)" },
  searchBtnTxt: { color: "#cbbcff", fontWeight: "900", fontSize: 14 },
  actionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  copyBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: "rgba(124,247,216,0.10)", borderWidth: 1, borderColor: "rgba(124,247,216,0.25)" },
  copyBtnTxt: { color: "#7cf7d8", fontWeight: "900", fontSize: 12 },

  userCard: { borderRadius: 16, padding: 12, marginBottom: 6, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" },
  userTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  userEmail: { color: "#FFF", fontSize: 14, fontWeight: "700", flex: 1, marginRight: 8 },
  badgeRow: { flexDirection: "row", gap: 5 },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, fontSize: 10, fontWeight: "900", overflow: "hidden" },
  userMeta: { color: "rgba(255,255,255,0.38)", fontSize: 11, fontWeight: "600" },

  /* Accounting */
  highlightCard: { borderRadius: 18, padding: 16, marginVertical: 8, backgroundColor: "rgba(94,59,255,0.12)", borderWidth: 1, borderColor: "rgba(94,59,255,0.25)" },
  highlightLabel: { color: "rgba(255,255,255,0.50)", fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 4 },
  highlightValue: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  highlightSub: { color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 4 },

  emailRow: { color: "rgba(255,255,255,0.70)", fontSize: 13, paddingVertical: 4 },

  orderRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" },
  orderProduct: { color: "#FFF", fontSize: 13, fontWeight: "700" },
  orderEmail: { color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 2 },
  orderAmount: { color: "#fcd34d", fontSize: 14, fontWeight: "900" },
  orderStatus: { fontSize: 11, fontWeight: "700", marginTop: 2 },

  /* Flow */
  flowCard: { borderRadius: 14, padding: 12, marginBottom: 6, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" },
  flowTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  flowDot: { width: 8, height: 8, borderRadius: 4 },
  flowTitle: { color: "#FFF", fontSize: 13, fontWeight: "800", flex: 1 },
  flowTime: { color: "rgba(255,255,255,0.40)", fontSize: 11 },
  flowText: { color: "rgba(255,255,255,0.65)", fontSize: 12, lineHeight: 18 },
  flowDate: { color: "rgba(255,255,255,0.30)", fontSize: 10, marginTop: 4 },

  /* Analytics */
  periodRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  periodChip: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  periodActive: { backgroundColor: "rgba(94,59,255,0.25)", borderColor: "rgba(124,247,216,0.20)" },
  periodText: { color: "rgba(255,255,255,0.50)", fontWeight: "800", fontSize: 13 },
  periodTextActive: { color: "#FFF" },

  /* Events */
  eventRow: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" },
  eventAction: { color: "#FFF", fontSize: 13, fontWeight: "700" },
  eventMeta: { color: "rgba(255,255,255,0.40)", fontSize: 11, marginTop: 2 },
});
