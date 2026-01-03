import React, { useState } from 'react';
import { useTools } from '../services/hooks/useTools';
import { useLanguage } from '../services/LanguageContext';
import { ToolDefinition, ToolId } from './tools/types';
import {
    Baby, GlassWater, Layers, Moon, Pill, Ruler, Smile, Utensils,
    Timer, Droplets, Syringe, Thermometer, Activity, FileText, Trophy,
    Mic, Calendar, Circle, ChevronRight, Plus, SlidersHorizontal, X,
    RotateCcw, ShieldCheck
} from 'lucide-react';

// Widget Imports
import { BreastfeedingDashboard, BreastfeedingFull } from './tools/BreastfeedingWidget';
import { DiaperDashboard, DiaperFull } from './tools/DiaperWidget';
import { BottleDashboard, BottleFull } from './tools/BottleWidget';
import { MedsDashboard, MedsFull } from './tools/MedsWidget';
import { SleepDashboard, SleepFull } from './tools/SleepWidget';
import { GrowthDashboard, GrowthFull } from './tools/GrowthWidget';
import { TempDashboard, TempFull } from './tools/TemperatureWidget';
import { SolidsDashboard, SolidsFull } from './tools/SolidsWidget';
import { PumpingDashboard, PumpingFull } from './tools/PumpingWidget';
import { VaccinesDashboard, VaccinesFull } from './tools/VaccinesWidget';
import { TeethingDashboard, TeethingFull } from './tools/TeethingWidget';
import { MilestonesDashboard, MilestonesFull } from './tools/MilestonesWidget';
import { NotesDashboard, NotesFull } from './tools/NotesWidget';
import { AgendaDashboard, AgendaFull } from './tools/AgendaWidget';
import { FirstWordsDashboard, FirstWordsFull } from './tools/FirstWordsWidget';
import { RoutineDashboard, RoutineFull } from './tools/RoutineWidget';
import { HeadPositionDashboard, HeadPositionFull } from './tools/HeadPositionWidget';
import { EndocrineDashboard, EndocrineFull } from './tools/EndocrineWidget';

// Configuration for Core tools
const TOOLS_CONFIG: ToolDefinition[] = [
    { id: 'breastfeeding', icon: Baby, translationKey: 'tool_breastfeeding', color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
    { id: 'bottle', icon: GlassWater, translationKey: 'tool_bottle', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { id: 'solids', icon: Utensils, translationKey: 'tool_solids', color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
    { id: 'diapers', icon: Layers, translationKey: 'tool_diapers', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
    { id: 'sleep', icon: Moon, translationKey: 'tool_sleep', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
    { id: 'routines', icon: Activity, translationKey: 'tool_routines', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
    { id: 'growth', icon: Ruler, translationKey: 'tool_growth', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { id: 'first_words', icon: Mic, translationKey: 'tool_first_words', color: 'text-fuchsia-400', bgColor: 'bg-fuchsia-500/10' },
    { id: 'teething', icon: Smile, translationKey: 'tool_teething', color: 'text-rose-400', bgColor: 'bg-rose-500/10' },
    { id: 'meds', icon: Pill, translationKey: 'tool_meds', color: 'text-red-400', bgColor: 'bg-red-500/10' },
    { id: 'vaccines', icon: Syringe, translationKey: 'tool_vaccines', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { id: 'fever', icon: Thermometer, translationKey: 'tool_fever', color: 'text-red-500', bgColor: 'bg-red-500/10' },
    { id: 'pumping', icon: Droplets, translationKey: 'tool_pumping', color: 'text-violet-400', bgColor: 'bg-violet-500/10' },
    { id: 'pediatrician_notes', icon: FileText, translationKey: 'tool_pediatrician_notes', color: 'text-slate-400', bgColor: 'bg-slate-500/10' },
    { id: 'milestones', icon: Trophy, translationKey: 'tool_milestones', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    { id: 'medical_agenda', icon: Calendar, translationKey: 'tool_medical_agenda', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'head_position', icon: RotateCcw, translationKey: 'tool_head_position', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { id: 'endocrine_info', icon: ShieldCheck, translationKey: 'tool_endocrine_info', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
];


export const ToolsView: React.FC<{ onOpenSettings: () => void }> = ({ onOpenSettings }) => {
    const { t } = useLanguage();
    const { activeTools, toggleTool } = useTools();
    const [isManageMode, setIsManageMode] = useState(false);

    // Initialize from history state if present, to handle reloads/navigation better
    const [selectedToolId, setSelectedToolId] = useState<ToolId | null>(() => {
        const state = window.history.state;
        return state?.toolId || null;
    });

    // Handle Browser Back Button
    React.useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            const state = event.state;
            if (state && state.toolId) {
                setSelectedToolId(state.toolId);
            } else {
                setSelectedToolId(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleOpenTool = (id: ToolId) => {
        setSelectedToolId(id);
        window.history.pushState({ tab: 'tools', toolId: id }, '');
    };

    const handleCloseTool = () => {
        // If we have history state, go back. Otherwise (direct load?), just nullify.
        // But for safety to match our pushState logic:
        if (window.history.state?.toolId) {
            window.history.back();
        } else {
            setSelectedToolId(null);
        }
    };

    // Filter tools
    const activeToolsList = TOOLS_CONFIG.filter(tool => activeTools.includes(tool.id));
    const availableToolsList = TOOLS_CONFIG.filter(tool => !activeTools.includes(tool.id));

    const renderToolContent = (toolId: ToolId) => {
        switch (toolId) {
            case 'breastfeeding': return <BreastfeedingFull onClose={handleCloseTool} />;
            case 'diapers': return <DiaperFull onClose={handleCloseTool} />;
            case 'bottle': return <BottleFull onClose={handleCloseTool} />;
            case 'meds': return <MedsFull onClose={handleCloseTool} />;
            case 'sleep': return <SleepFull onClose={handleCloseTool} />;
            case 'growth': return <GrowthFull onClose={handleCloseTool} onOpenSettings={onOpenSettings} />;
            case 'fever': return <TempFull onClose={handleCloseTool} />;
            case 'solids': return <SolidsFull onClose={handleCloseTool} />;
            case 'pumping': return <PumpingFull onClose={handleCloseTool} />;
            case 'vaccines': return <VaccinesFull onClose={handleCloseTool} />;
            case 'teething': return <TeethingFull onClose={handleCloseTool} />;
            case 'milestones': return <MilestonesFull onClose={handleCloseTool} />;
            case 'pediatrician_notes': return <NotesFull onClose={handleCloseTool} />;
            case 'medical_agenda': return <AgendaFull onClose={handleCloseTool} />;
            case 'first_words': return <FirstWordsFull onClose={handleCloseTool} />;
            case 'routines': return <RoutineFull onClose={handleCloseTool} />;
            case 'head_position': return <HeadPositionFull onClose={handleCloseTool} onOpenSettings={onOpenSettings} />;
            case 'endocrine_info': return <EndocrineFull onClose={handleCloseTool} />;
            default: return (
                <div className="p-8 text-center flex flex-col items-center justify-center h-full opacity-60">
                    <p className="text-slate-400 text-lg mb-2">Próximamente...</p>
                    <p className="text-xs text-slate-600 max-w-[200px] leading-relaxed">Estamos trabajando en esta herramienta.</p>
                </div>
            );
        }
    };

    const renderDashboardWidget = (id: ToolId) => {
        switch (id) {
            case 'breastfeeding': return <BreastfeedingDashboard />;
            case 'diapers': return <DiaperDashboard />;
            case 'bottle': return <BottleDashboard />;
            case 'meds': return <MedsDashboard />;
            case 'sleep': return <SleepDashboard />;
            case 'growth': return <GrowthDashboard />;
            case 'fever': return <TempDashboard />;
            case 'solids': return <SolidsDashboard />;
            case 'pumping': return <PumpingDashboard />;
            case 'vaccines': return <VaccinesDashboard />;
            case 'teething': return <TeethingDashboard />;
            case 'milestones': return <MilestonesDashboard />;
            case 'pediatrician_notes': return <NotesDashboard />;
            case 'medical_agenda': return <AgendaDashboard />;
            case 'first_words': return <FirstWordsDashboard />;
            case 'routines': return <RoutineDashboard />;
            case 'head_position': return <HeadPositionDashboard />;
            case 'endocrine_info': return <EndocrineDashboard />;
            default: return "--";
        }
    };

    return (
        <div className="flex-1 overflow-y-auto pb-24 px-1 relative animate-[fade-in_0.5s_ease-out]">

            {/* Tool Detail Modal */}
            {selectedToolId && (
                <div className="fixed inset-0 z-[60] bg-slate-950 animate-[slide-up_0.2s_ease-out] flex flex-col">
                    {/* Modal Header */}
                    <div className="p-4 flex items-center gap-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
                        <button
                            onClick={handleCloseTool}
                            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ChevronRight className="rotate-180" size={24} />
                        </button>
                        <h2 className="text-lg font-bold text-white flex-1 text-center pr-8">
                            {t(`tool_${selectedToolId}` as any)}
                        </h2>
                    </div>
                    {/* Modal Content */}
                    <div className="flex-1 overflow-hidden">
                        {renderToolContent(selectedToolId)}
                    </div>
                </div>
            )}

            {/* Header with Manage Toggle */}
            <div className="px-4 pt-4 mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-orange-50 font-['Quicksand']">{t('tab_tools')}</h2>
                    <p className="text-xs text-slate-400 font-medium tracking-wide">
                        {isManageMode ? t('tools_manage') : `${activeTools.length} ${t('tool_active')}`}
                    </p>
                </div>
                <button
                    onClick={() => setIsManageMode(!isManageMode)}
                    className={`p-2.5 rounded-full border transition-all duration-300 ${isManageMode
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                        : 'bg-slate-800 border-white/5 text-slate-400 hover:text-white'
                        }`}
                >
                    {isManageMode ? <X size={20} /> : <SlidersHorizontal size={20} />}
                </button>
            </div>

            {/* Content Switch: Dashboard vs Manage Mode */}
            {isManageMode ? (
                <div className="px-4 space-y-8 animate-[fade-in_0.2s_ease-out]">

                    {/* Active Section */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-1">{t('tool_active')}</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {activeToolsList.map(tool => (
                                <div key={tool.id} onClick={() => toggleTool(tool.id)} className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-teal-500/30 cursor-pointer hover:bg-slate-800 transform active:scale-[0.98] transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${tool.bgColor} ${tool.color}`}>
                                            <tool.icon size={20} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-200">{t(tool.translationKey as any)}</span>
                                    </div>
                                    <div className="p-1.5 rounded-full bg-red-500/10 text-red-400">
                                        <X size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Available Section */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-1">{t('tool_available')}</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {availableToolsList.map(tool => (
                                <div key={tool.id} onClick={() => toggleTool(tool.id)} className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-white/5 cursor-pointer hover:bg-slate-800/80 transform active:scale-[0.98] transition-all">
                                    <div className="flex items-center gap-3 opacity-60">
                                        <div className={`p-2 rounded-xl ${tool.bgColor} ${tool.color}`}>
                                            <tool.icon size={20} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-400">{t(tool.translationKey as any)}</span>
                                    </div>
                                    <div className="p-1.5 rounded-full bg-teal-500/10 text-teal-400">
                                        <Plus size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                // DASHBOARD GRID
                <div className="px-4 grid grid-cols-2 gap-3 animate-[fade-in_0.3s_ease-out]">
                    {activeToolsList.map(tool => (
                        <div
                            key={tool.id}
                            onClick={() => handleOpenTool(tool.id)}
                            className="bg-slate-800/50 backdrop-blur-md rounded-[1.5rem] p-4 border border-white/5 hover:bg-slate-800 transition-all cursor-pointer group relative overflow-hidden h-32 flex flex-col justify-between active:scale-[0.98]"
                        >
                            {/* Icon Bg Glow */}
                            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 ${tool.bgColor.replace('/10', '')}`} />

                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tool.bgColor} ${tool.color} mb-3`}>
                                <tool.icon size={20} strokeWidth={2.5} />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-200 leading-tight mb-0.5">{t(tool.translationKey as any)}</h3>
                                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide min-h-[1.5em]">
                                    {renderDashboardWidget(tool.id)}
                                </div>
                            </div>

                            {/* Chevron */}
                            <div className="absolute top-4 right-4 text-slate-600 group-hover:text-slate-400 transition-colors">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    ))}

                    {/* Empty State / Add Prompt */}
                    {activeToolsList.length === 0 && (
                        <div onClick={() => setIsManageMode(true)} className="col-span-2 py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer hover:border-white/20 hover:bg-white/5 transition-all text-slate-500">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-slate-400">
                                <Plus size={24} />
                            </div>
                            <p className="text-sm font-bold">{t('tool_add_title')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
