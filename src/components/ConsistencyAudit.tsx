import React, { useState } from 'react';
import { TOP_FACTORS, MODEL_TRAINING_METRICS } from '../data/reportData';
import { GitCompare, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Layers, Shuffle, Info } from 'lucide-react';

export const ConsistencyAudit: React.FC = () => {
  const [selectedSubTab, setSelectedSubTab] = useState<'schema' | 'horizons' | 'sign_flip' | 'target'>('schema');

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex border-b border-slate-800 space-x-4">
        <button
          onClick={() => setSelectedSubTab('schema')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center space-x-2 ${
            selectedSubTab === 'schema'
              ? 'border-amber-500 text-amber-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>流水线特征 Schema 错配比对</span>
        </button>
        <button
          onClick={() => setSelectedSubTab('horizons')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center space-x-2 ${
            selectedSubTab === 'horizons'
              ? 'border-amber-500 text-amber-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>多周期尺度与时滞一致性 (HAC)</span>
        </button>
        <button
          onClick={() => setSelectedSubTab('sign_flip')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center space-x-2 ${
            selectedSubTab === 'sign_flip'
              ? 'border-amber-500 text-amber-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shuffle className="w-4 h-4" />
          <span>符号反转与跨期漂移 (Regime Shift)</span>
        </button>
        <button
          onClick={() => setSelectedSubTab('target')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center space-x-2 ${
            selectedSubTab === 'target'
              ? 'border-amber-500 text-amber-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>模型标签与经济目标错配</span>
        </button>
      </div>

      {/* Tab 1: Pipeline Feature Schema Mismatch */}
      {selectedSubTab === 'schema' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">特征全生命周期链路流转对比矩阵 (严重错配)</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  日志明文警告：<code className="text-rose-300 font-mono">DatasetBuilder feature order differs from model feature order</code>。
                  由于上一轮模型被 Gate 拒绝，线上模型文件仍然是拥有 3 个旧特征的权重模型，但下游代码强制传入新 Genome 的 2 个特征，导致特征语义直接被错乱覆盖！
                </p>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-300">
                    <th className="py-2.5 px-3">特征名称 (Feature Name)</th>
                    <th className="py-2.5 px-3">挖掘池 (Candidate)</th>
                    <th className="py-2.5 px-3">证据过滤 (Evidence V6.3)</th>
                    <th className="py-2.5 px-3">Alpha Genome</th>
                    <th className="py-2.5 px-3">本次训练输入 (Train)</th>
                    <th className="py-2.5 px-3">磁盘实际加载模型 (Model.txt)</th>
                    <th className="py-2.5 px-3 text-right">最终一致性状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="bg-rose-950/20">
                    <td className="py-2 px-3 font-semibold text-amber-300">feat_trend_score_cs</td>
                    <td className="py-2 px-3 text-emerald-400">✅ 包含</td>
                    <td className="py-2 px-3 text-amber-400">⚠️ 兜底入选 (取反)</td>
                    <td className="py-2 px-3 text-emerald-400">✅ 包含 (* -1)</td>
                    <td className="py-2 px-3 text-emerald-400">✅ 2号位</td>
                    <td className="py-2 px-3 text-rose-400 font-bold">❌ 不存在于旧模型</td>
                    <td className="py-2 px-3 text-right text-rose-400 font-semibold">严重错配 (Schema Missing)</td>
                  </tr>
                  <tr className="bg-rose-950/20">
                    <td className="py-2 px-3 font-semibold text-amber-300">feat_money_flow_mean_day_cs</td>
                    <td className="py-2 px-3 text-emerald-400">✅ 包含</td>
                    <td className="py-2 px-3 text-amber-400">⚠️ 兜底入选</td>
                    <td className="py-2 px-3 text-emerald-400">✅ 包含</td>
                    <td className="py-2 px-3 text-emerald-400">✅ 1号位 (权重88%)</td>
                    <td className="py-2 px-3 text-rose-400 font-bold">❌ 不存在于旧模型</td>
                    <td className="py-2 px-3 text-right text-rose-400 font-semibold">严重错配 (Schema Missing)</td>
                  </tr>
                  <tr className="bg-slate-900/30">
                    <td className="py-2 px-3 text-slate-400">feat_money_surge_day_month_cs</td>
                    <td className="py-2 px-3 text-emerald-400">✅ 包含</td>
                    <td className="py-2 px-3 text-slate-500">❌ 被排除</td>
                    <td className="py-2 px-3 text-slate-500">❌ 无</td>
                    <td className="py-2 px-3 text-slate-500">❌ 未训练</td>
                    <td className="py-2 px-3 text-amber-400 font-bold">⚠️ 仍在旧模型1号位</td>
                    <td className="py-2 px-3 text-right text-amber-400">残留僵尸特征</td>
                  </tr>
                  <tr className="bg-slate-900/30">
                    <td className="py-2 px-3 text-slate-400">feat_micro_voi_ema_fast_cs</td>
                    <td className="py-2 px-3 text-emerald-400">✅ 包含</td>
                    <td className="py-2 px-3 text-slate-500">❌ 被排除</td>
                    <td className="py-2 px-3 text-slate-500">❌ 无</td>
                    <td className="py-2 px-3 text-slate-500">❌ 未训练</td>
                    <td className="py-2 px-3 text-amber-400 font-bold">⚠️ 仍在旧模型2号位</td>
                    <td className="py-2 px-3 text-right text-amber-400">残留僵尸特征</td>
                  </tr>
                  <tr className="bg-slate-900/30">
                    <td className="py-2 px-3 text-slate-400">feat_micro_voi_mean_day_cs</td>
                    <td className="py-2 px-3 text-emerald-400">✅ 包含</td>
                    <td className="py-2 px-3 text-slate-500">❌ 被排除</td>
                    <td className="py-2 px-3 text-slate-500">❌ 无</td>
                    <td className="py-2 px-3 text-slate-500">❌ 未训练</td>
                    <td className="py-2 px-3 text-amber-400 font-bold">⚠️ 仍在旧模型3号位</td>
                    <td className="py-2 px-3 text-right text-amber-400">残留僵尸特征</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs">
              <span className="font-semibold text-rose-400 uppercase text-[11px] tracking-wider block mb-1">
                致死机理：事务回滚机制缺失
              </span>
              <p className="text-slate-300 leading-relaxed">
                当训练流程在 <code className="text-amber-300 font-mono">train.py</code> 检测到健康评分 60 分拒绝保存新模型时，
                程序抛出了 Warning 但整个 Pipeline 继续执行（PASS: Model Training &amp; Production Freeze 3.7s）。
                后续阶段 <code className="text-amber-300 font-mono">Dual Alpha Pipeline</code> 读取了新的配置，却加载了旧的二进制权重。
                预测矩阵只有 2 列，模型树分裂却索引到第 3 列，直接导致非预期随机预测甚至越界！
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs">
              <span className="font-semibold text-emerald-400 uppercase text-[11px] tracking-wider block mb-1">
                工程改善标准
              </span>
              <p className="text-slate-300 leading-relaxed">
                1. <strong>原子事务锁</strong>：若门禁 REJECT，立即终止下游 Dual Alpha 评估，并退出非 0 状态码；<br />
                2. <strong>模型指纹与校验</strong>：在每个导出的模型头中注入 <code className="text-amber-300 font-mono">feature_names_hash</code>，
                推理阶段做运行时输入 schema 强制对齐断言，特征名称或数量不一致时拒绝推理。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Multi-Horizon Scale Consistency */}
      {selectedSubTab === 'horizons' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
            <h3 className="text-base font-semibold text-white">多预测周期 IC 响应矩阵与 Newey-West HAC 衰减检验</h3>
            <p className="text-xs text-slate-400 mt-1">
              比较同一特征在 ret_day (1天), ret_swing (3天), ret_fortnight (10天), ret_month (20天) 上的截面 RankIC 表现。
              重点关注经 Newey-West (HAC) 消除序列自相关后的实际有效信息比率 (ICIR_NW)。
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-300">
                    <th className="py-2.5 px-3">特征名称</th>
                    <th className="py-2.5 px-3">1日 IC (Day)</th>
                    <th className="py-2.5 px-3">3日 IC (Swing)</th>
                    <th className="py-2.5 px-3">10日 IC (Fortnight)</th>
                    <th className="py-2.5 px-3">20日 IC (Month)</th>
                    <th className="py-2.5 px-3">原始 ICIR</th>
                    <th className="py-2.5 px-3 text-amber-300">HAC调整 ICIR_NW</th>
                    <th className="py-2.5 px-3 text-right">自相关水分衰减率</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {TOP_FACTORS.map((factor) => {
                    const decayRatio = factor.icir_nw && factor.icir
                      ? ((1 - Math.abs(factor.icir_nw) / Math.abs(factor.icir)) * 100).toFixed(1)
                      : 'N/A';
                    return (
                      <tr key={factor.name} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-semibold text-slate-200">{factor.name}</td>
                        <td className="py-2 px-3">{factor.ic_ret_day.toFixed(4)}</td>
                        <td className="py-2 px-3 text-amber-300">{factor.ic_ret_swing.toFixed(4)}</td>
                        <td className="py-2 px-3">{factor.ic_ret_fortnight.toFixed(4)}</td>
                        <td className="py-2 px-3 text-indigo-300">{factor.ic_ret_month.toFixed(4)}</td>
                        <td className="py-2 px-3">{factor.icir.toFixed(3)}</td>
                        <td className="py-2 px-3 text-amber-400 font-bold">
                          {factor.icir_nw ? factor.icir_nw.toFixed(3) : '-'}
                        </td>
                        <td className="py-2 px-3 text-right text-rose-400">
                          {decayRatio !== 'N/A' ? `-${decayRatio}%` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/50 text-xs text-amber-200">
            <h4 className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>数据一致性诊断：长周期重叠收益导致的假性显著性陷阱</span>
            </h4>
            <p className="leading-relaxed">
              在报告中，<code className="font-mono text-white">feat_money_divergence_month_cs</code> 在月度周期的名义 ICIR 达到了惊人的 <strong>-3.3252</strong>，
              t_stat 更是高达 -10.89。然而，经过 Newey-West HAC 滞后调整自相关后，真实 ICIR 瞬间跌至 <strong>-1.2662</strong>（缩水超过 62%）。
              这是因为 20 个交易日的重叠滚动收益导致临近样本序列自相关极高。如果不做 HAC 调整直接输入到模型，模型将对该“伪强因子”产生严重过拟合。
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Sign Flip & Regime Shift */}
      {selectedSubTab === 'sign_flip' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
            <h3 className="text-base font-semibold text-white">发现期 vs 验证期 vs 测试期 符号反转诊断 (Regime Shift)</h3>
            <p className="text-xs text-slate-400 mt-1">
              挖掘出的 45 个因子中，竟然有 19 个因子在从发现期到验证期跨越时发生了 IC 符号颠倒（例如正相关变负相关）。
              进入模型生产训练的仅存两个因子中，又有 1 个在 OOS 测试集上发生反转！
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-800/60">
                <span className="text-xs font-mono font-bold text-rose-400 block mb-1">
                  1. 模型训练中的 OOS_FLIP：feat_money_flow_mean_day_cs
                </span>
                <div className="space-y-1.5 text-xs text-slate-300 font-mono mt-2">
                  <div className="flex justify-between">
                    <span>Train IC (训练集 157期):</span>
                    <span className="text-emerald-400 font-bold">+0.0284</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Val IC (验证集 50期):</span>
                    <span className="text-emerald-400 font-bold">+0.0443</span>
                  </div>
                  <div className="flex justify-between border-t border-rose-800/40 pt-1">
                    <span className="text-rose-300 font-bold">Test IC (OOS测试集 100期):</span>
                    <span className="text-rose-400 font-bold bg-rose-500/20 px-1.5 py-0.5 rounded">-0.0101 (FLIP!)</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  解析：资金流均值在训练和验证时呈动量效应，但到了 8月底至 9月中旬的 OOS 周期直接变为反转杀估值行情，模型给予其 88% 的绝大权重，在实盘中必死无疑。
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/60">
                <span className="text-xs font-mono font-bold text-amber-400 block mb-1">
                  2. 强制取反的疑虑：feat_trend_score_cs [INVERT * -1]
                </span>
                <div className="space-y-1.5 text-xs text-slate-300 font-mono mt-2">
                  <div className="flex justify-between">
                    <span>原始 IC (全样本均值):</span>
                    <span className="text-slate-400">+0.0143 (偏微弱)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discovery 阶段 Multi-IC:</span>
                    <span className="text-rose-400 font-bold">-0.0826 (负相关)</span>
                  </div>
                  <div className="flex justify-between border-t border-amber-800/40 pt-1">
                    <span className="text-amber-300 font-bold">人为操作:</span>
                    <span className="text-amber-300 font-bold">强行乘 -1 (反转作为做空趋势指标)</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  解析：趋势因子本意为顺势指标。如果在发现期呈现负 IC，很可能是遇到了盘整反转震荡市。暴力乘 -1 等同于将其作为逆势反转指标，未考虑其背后的经济学直觉一致性。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Target Alignment */}
      {selectedSubTab === 'target' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
            <h3 className="text-base font-semibold text-white">模型优化目标 (Loss Function) 与真实投资收益 (PnL) 的目标不一致</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              在 LambdaRank 训练日志中，模型使用的排序目标是离散化等级标签：<code className="text-amber-300 font-mono">active_rank_label_discrete</code>，
              而最终经济评估目标是连续未来收益率：<code className="text-emerald-300 font-mono">future_return_swing</code>。
            </p>

            <div className="mt-4 p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>训练目标 (Model Ranking Target):</span>
                <span className="text-amber-400 font-semibold">active_rank_label_discrete (NDCG@k 评估)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>经济收益目标 (Economic PnL Target):</span>
                <span className="text-emerald-400 font-semibold">future_return_swing (连续3日收益率)</span>
              </div>
              <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-2">
                <span>模型预测得分 vs 训练标签相关性:</span>
                <span className="text-slate-200">Spearman = 0.1449 (N=12,372)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>模型预测得分 vs 经济收益率 (ret_swing):</span>
                <span className="text-rose-400 font-bold">Spearman = 0.0699 (直接腰斩，断层衰减)</span>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-400 block mb-1">关键结论：</strong>
              NDCG 关注的是头部的排序顺序，若分箱标签构建不合理（例如强行划分成 10 个均匀分位数，但股票收益率呈厚尾不对称分布），
              模型为了在 NDCG@1 或 NDCG@3 上获得极高分数，往往会挑选波动率极大的极端个股，而忽略了整体预测期望值的线性单调性。这也是为何
              Quantile 收益在 Q1~Q5 之间没有呈现单调递增，反而 Q2 (0.756%) 高于 Q1 (0.636%)！
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
