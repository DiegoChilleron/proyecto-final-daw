module.exports = {
  apps: [
    {
      name: 'creador-de-webs',
      script: 'npm',
      args: 'start',
      instances: 'max', // Usa todos los núcleos CPU disponibles
      exec_mode: 'cluster', // Modo cluster para balanceo de carga
      autorestart: true,
      watch: false, // No watches en producción
      max_memory_restart: '1G', // Reinicia si supera 1GB RAM
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true,
    },
  ],
};
