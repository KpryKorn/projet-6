---
author: sofia_k
subject: Python
hoursAgo: 38
popularity: 0.7
title: uv a remplacé pip, venv et pipx sur ma machine
---
Je jonglais entre `pip`, `venv`, `pip-tools` et `pipx` selon les projets. `uv` fait tout cela avec une seule commande, et beaucoup plus vite, parce qu’il est écrit en Rust et réutilise un cache global.

```bash
uv init analyse-ventes
cd analyse-ventes
uv add pandas matplotlib
uv run python analyse.py
```

`uv add` met à jour `pyproject.toml` ainsi qu’un fichier `uv.lock`, que je versionne. Un collègue qui clone le dépôt lance `uv sync` et obtient exactement les mêmes versions que moi. Pour les outils en ligne de commande, `uvx ruff check .` les exécute dans un environnement jetable, sans rien installer globalement.

Mon seul regret est d’avoir mis une journée à convaincre l’équipe de supprimer les anciens fichiers `requirements.txt`.
