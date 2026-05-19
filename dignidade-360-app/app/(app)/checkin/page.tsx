'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckinPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pain: 0, breath: 0, anxiety: 0, fatigue: 0, appetite: 10, burden: 0,
    sleep: 'Normal', mobility: 'Independente', crisis: false, note: ''
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/checkins', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (res.ok) {
      await res.json();
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Check-in de Sintomas</h1>
          <span className="view-kicker">Avaliação contínua</span>
        </div>
      </header>
      
      <div className="grid-2 wide-left">
        <section className="panel">
          <form className="form" onSubmit={handleSubmit}>
            <div className="sliders">
              <label>Dor <input type="range" name="pain" min="0" max="10" value={formData.pain} onChange={handleChange} /><output>{formData.pain}</output></label>
              <label>Falta de ar <input type="range" name="breath" min="0" max="10" value={formData.breath} onChange={handleChange} /><output>{formData.breath}</output></label>
              <label>Ansiedade <input type="range" name="anxiety" min="0" max="10" value={formData.anxiety} onChange={handleChange} /><output>{formData.anxiety}</output></label>
              <label>Fadiga <input type="range" name="fatigue" min="0" max="10" value={formData.fatigue} onChange={handleChange} /><output>{formData.fatigue}</output></label>
              <label>Apetite <input type="range" name="appetite" min="0" max="10" value={formData.appetite} onChange={handleChange} /><output>{formData.appetite}</output></label>
              <label>Sobrecarga do cuidador <input type="range" name="burden" min="0" max="10" value={formData.burden} onChange={handleChange} /><output>{formData.burden}</output></label>
            </div>
            
            <div className="form-row">
              <label>Sono
                <select name="sleep" value={formData.sleep} onChange={handleChange}>
                  <option>Normal</option>
                  <option>Interrompido</option>
                  <option>Ruim</option>
                </select>
              </label>
              <label>Mobilidade
                <select name="mobility" value={formData.mobility} onChange={handleChange}>
                  <option>Independente</option>
                  <option>Precisa de ajuda</option>
                  <option>Restrito ao leito</option>
                </select>
              </label>
            </div>

            <label className="checkline">
              <input type="checkbox" name="crisis" checked={formData.crisis} onChange={handleChange} />
              <div>
                <strong>Sinais de alerta do plano de crise</strong>
                <span>Marque se houver confusão mental, sangramento, ou dor/falta de ar incontrolável.</span>
              </div>
            </label>

            <label>
              <span>Observações extras</span>
              <textarea name="note" rows={3} value={formData.note} onChange={handleChange} placeholder="Como está se sentindo hoje?"></textarea>
            </label>

            <div className="actions">
              <button type="submit" className="primary">Salvar Check-in e Enviar</button>
            </div>
          </form>
        </section>
        
        <aside className="panel">
          <header className="panel-head">
            <h2>Prévia de Risco</h2>
          </header>
          <div className="notice">
            <span>O sistema calcula automaticamente a prioridade baseada nas respostas, gerando alertas para a equipe em caso de piora significativa.</span>
          </div>
        </aside>
      </div>
    </>
  );
}
