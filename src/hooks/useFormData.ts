'use client';

import { useState, useCallback } from 'react';
import { FormData } from '@/lib/types';
import { DataManager } from '@/lib/data-manager';

export function useFormData() {
  const [data, setData] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    try {
      const allData = DataManager.getAllData();
      setData(allData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveFormData = useCallback((formData: FormData) => {
    try {
      DataManager.saveFormData(formData);
      loadData(); // Recarrega os dados após salvar
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return false;
    }
  }, [loadData]);

  const exportData = useCallback((filename?: string) => {
    try {
      DataManager.exportToCSV(data, filename);
      return true;
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      return false;
    }
  }, [data]);

  const clearAllData = useCallback(() => {
    try {
      DataManager.clearAllData();
      setData([]);
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      return false;
    }
  }, []);

  return {
    data,
    loading,
    loadData,
    saveFormData,
    exportData,
    clearAllData
  };
}