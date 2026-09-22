import React, { useState } from 'react';
import { TOP_FACTORS } from '../data/reportData';
import { FactorMetric } from '../types';
import { Search, Filter, ArrowUpDown, ChevronRight, Activity, CheckCircle, XCircle, AlertTriangle, Layers, Info } from 'lucide-react';

export const FactorExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<keyof FactorMetric>('icir');
  const [sortAsc, setSortAsc] = useState(false);
  const [activeFactor, setActiveFactor] = useState<FactorMetric | null>(TOP_FACTORS[0]);

  const categories = [
    { id: 'ALL', label: '全部类别' },
    { id: 'volatility', label: '波动率类' },
    { id: 'money_flow', label: '资金流类' },
    { id: 'microstructure', label: '微观结构类' },
    { id: 'trend', label: '趋势动量类' },
    { id: 'entropy', label: '信息熵类' },
    { id: 'prediction', label: '模型衍生类' },
  ];

  const filteredFactors = TOP_FACTORS.filter((factor) => {
    const matchesSearch = factor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || factor.category === selectedCategory;
    return matchesSearch && matchesCat;
  }).sort((a, b) => {
    const valA = a[sortBy] ?? -999;
    const valB = b[sortBy] ?? -999;
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return 0;
  });

  const handleSort = (field: keyof FactorMetric) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="搜索特征名称（如 feat_vol, money_flow）..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Factor List & Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Table list */}
        <div className="lg:col-span-7 bg-slate-850 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">特征全景指标对比表 ({filteredFactors.length} 个)</h4>
            <span className="text-xs text-slate-400">点击任意因子查看多周期衰减详情</span>
          </div>

          <div className="overflow-x-auto max-h-[580px] overflow-y-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="sticky top-0 bg-slate-900 text-slate-300 border-b border-slate-700 z-10">
                <tr>
                  <th className="py-2.5 px-3">特征名称</th>
                  <th
                    className="py-2.5 px-2 cursor-pointer hover:text-amber-400"
                    onClick={() => handleSort('ic_mean')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>IC均值</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-2.5 px-2 cursor-pointer hover:text-amber-400"
                    onClick={() => handleSort('icir')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>ICIR</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-2.5 px-2 cursor-pointer hover:text-amber-400"
                    onClick={() => handleSort('icir_nw')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>ICIR_NW</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-2.5 px-2 cursor-pointer hover:text-amber-400"
                    onClick={() => handleSort('stability_score')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>稳定性</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-2.5 px-2">基因状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredFactors.map((factor) => {
                  const isSelected = activeFactor?.name === factor.name;
                  return (
                    <tr
                      key={factor.name}
                      onClick={() => setActiveFactor(factor)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-500/15 border-l-4 border-amber-500 text-white font-medium'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-semibold">{factor.name}</div>
                        <div className="text-[10px] text-slate-500 font-sans">{factor.category}</div>
                      </td>
                      <td className="py-2.5 px-2">
                        {factor.ic_mean > 0 ? `+${factor.ic_mean.toFixed(3)}` : factor.ic_mean.toFixed(3)}
                      </td>
                      <td className="py-2.5 px-2 font-bold text-amber-300">{factor.icir.toFixed(2)}</td>
                      <td className="py-2.5 px-2 font-mono text-emerald-400">
                        {factor.icir_nw ? factor.icir_nw.toFixed(2) : '-'}
                      </td>
                      <td className="py-2.5 px-2 font-mono">
                        {factor.stability_score ? (
                          <span
                            className={
                              factor.stability_score >= 0.5 ? 'text-emerald-400 font-bold' : 'text-slate-400'
                            }
                          >
                            {factor.stability_score.toFixed(3)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            factor.gene_status === 'VALID'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : factor.gene_status === 'REGIME_SHIFT'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : factor.gene_status === 'OBSERVE'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {factor.gene_status || 'INVALID'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail drawer / card */}
        <div className="lg:col-span-5 bg-slate-850 rounded-xl border border-slate-800 p-5 space-y-4">
          {activeFactor ? (
            <>
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {activeFactor.category}
                  </span>
                  {activeFactor.is_selected_in_genome && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      GENOME 最终选定 {activeFactor.is_inverted ? '(已取反)' : ''}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white mt-1.5 break-all font-mono">
                  {activeFactor.name}
                </h3>
              </div>

              {/* Horizon Bar Chart simulation */}
              <div>
                <h5 className="text-xs font-semibold text-slate-300 mb-2">多预测周期 IC 响应衰减</h5>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">1日 (Day)</span>
                    <span className="font-bold text-slate-200">{activeFactor.ic_ret_day.toFixed(3)}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-amber-400 block">3日 (Swing)</span>
                    <span className="font-bold text-amber-300">{activeFactor.ic_ret_swing.toFixed(3)}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">10日 (Fortnight)</span>
                    <span className="font-bold text-slate-200">{activeFactor.ic_ret_fortnight.toFixed(3)}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">20日 (Month)</span>
                    <span className="font-bold text-slate-200">{activeFactor.ic_ret_month.toFixed(3)}</span>
                  </div>
                </div>
              </div>

              {/* Diagnostics Grid */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">最优时序周期 (Best Horizon):</span>
                  <span className="text-amber-400 font-semibold">{activeFactor.best_horizon || 'ret_swing'}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">单调性评分 (Monotonicity):</span>
                  <span className="text-slate-200">
                    {activeFactor.monotonic_score ? `${activeFactor.monotonic_score}% (${activeFactor.monotonic_dir})` : '无显著单调'}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">随机森林相对重要性 (RF Importance):</span>
                  <span className="text-slate-200">
                    {activeFactor.rf_importance ? (activeFactor.rf_importance * 100).toFixed(2) + '%' : '-'}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">跨折留存率 (IC Retention):</span>
                  <span className="text-slate-200">
                    {activeFactor.ic_retention ? `${(activeFactor.ic_retention * 100).toFixed(1)}%` : '-'}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">基因稳定性原型 (Archetype):</span>
                  <span className="text-rose-400 font-bold">{activeFactor.stability_archetype || 'UNKNOWN'}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">失效首要归因 (Primary Cause):</span>
                  <span className="text-rose-400 font-bold">{activeFactor.primary_cause || 'NONE'}</span>
                </div>
              </div>

              {/* Assessment */}
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-amber-400 font-semibold block mb-1">【针对该因子的调优策略】</span>
                <p className="text-slate-300 leading-relaxed">
                  {activeFactor.gene_status === 'REGIME_SHIFT'
                    ? '在不同市场行情下发生符号颠倒，严禁简单线性入选。需与宏观波动率做交叉状态感知门控（如乘以波动率高低分位掩码）。'
                    : activeFactor.primary_cause === 'IC_RETENTION_FAILURE'
                    ? '历史 IC 严重衰减，说明该因子半衰期极短（如高频资金流），应通过加权移动平均或自适应滚动 Z-Score 缩短观察窗口。'
                    : activeFactor.name === 'feat_trend_score_cs'
                    ? '作为大盘动量指标，单特征乘 -1 存在风格赌博风险，建议与赫斯特指数结合形成趋势强弱条件过滤器。'
                    : '表现较为稳健，可作为 5 大族库的核心候选基底，进入正交化训练池。'}
                </p>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-500 text-center py-12">请在左侧列表中点击选择任意因子</div>
          )}
        </div>
      </div>
    </div>
  );
};
