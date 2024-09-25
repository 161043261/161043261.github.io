# LaTeX

```tex
% article.tex
\documentclass[12pt, letterpaper]{article}
\usepackage{graphicx} % /usepackage[options]{package}
\usepackage{epstopdf}
\graphicspath{{./images/}} % The images are under the "./images" directory
% =================== Title ====================
\title{LaTeX Tutorial}
\author{Tiancheng Hang\thanks{Referring from overleaf.com}}
\date{June 2024}
\begin{document}
\maketitle
\tableofcontents
% =================== Abstract ====================
\begin{abstract}
    Content of Abstract
\end{abstract}
% =================== Section ====================
\section{Introduction}
\section{Section A}
\section*{Unnumbered Section B}
\addcontentsline{toc}{section}{Unnumbered Section B}
% =================== emphasis, bold, underline, italic ====================
% md *Some* of  the **greatest** discoveries in <u>science</u> were made by ***accident***
\emph{Some} of the \textbf{greatest} discoveries in \underline{science} were made by \textbf{\textit{accident}}.
% =================== JPG, PNG ====================
\includegraphics[width=0.4\textwidth]{black.jpg} % ./images/black.jpg
\includegraphics[width=0.4\textwidth]{white.png} % ./images/white.jpg
% =================== eps ====================
\begin{figure}
    \centering
    \includegraphics[width=0.75\textwidth]{./assets/fit.eps}
    \caption{Force Deflection Data and curve fit}
    \label{fig:fit}
\end{figure}
Figure \ref{fig:fit} is on page \pageref{fig:fit}. % Figure 1 is on page 2.
% =================== Math ====================
The mass-energy equivalence is stated by the equation $E=mc^2$ discovered in 1905 by Albert Einstein. % $...$
The mass-energy equivalence is stated by the equation \(E=mc^2\) discovered in 1905 by Albert Einstein. % \(...\)
The mass-energy equivalence is stated by the equation
\begin{math}
    E=mc^2
\end{math}
discovered in 1905 by Albert Einstein. % \begin{math}...\end{math}
The mass-energy equivalence is stated by the equation
\[ E=mc^2 \] % center of the newline
discovered in 1905 by Albert Einstein. % \[ ... \]
Subscripts are written as $a_b$ and superscripts are written as $a^b$.
\[ T^{i_1 i_2 \dots i_p}_{j_1 j_2 \dots j_q} = T(x^{i_1},\dots,x^{i_p},e_{j_1},\dots,e_{j_q}) \]
Integrals are written as $\int$ and fractions are written as $\frac{a}{b}$.
\[ \int_0^1 \frac{dx}{e^x} =  \frac{e-1}{e} \]
Lower case Greek letters are written as $\omega$ $\delta$ etc. while upper case Greek letters are written as $\Omega$ $\Delta$.
% =================== Unordered list ====================
\begin{itemize}
    \item Enter enter twice to start a new line
    \item Use the \verb|\\|\\ to start a new line
    \item Use the command newline to start a new line % command \newline
\end{itemize}
% =================== Ordered list ====================
\begin{enumerate}
    \item Use the command hline to add horizontal rules above and below rows
    \item Use the vertical line parameter to add vertical rules between columns
\end{enumerate}
% =================== Tables ====================
Table \ref{table:dat} shows how to add a table caption and reference a table.
\begin{table}[ht!]
    \centering
    \begin{tabular}{|| c | c | c ||} % vertical line parameter
        \hline                       % command \hline
        Deflection & Col-Force & Beam-Force \\ [0.5ex]
        \hline
        \hline
        0.000      & 0         & 0          \\
        0.001      & 104       & 51         \\
        0.002      & 202       & 101        \\
        0.003      & 298       & 148        \\
        0.0031     & 290       & 209        \\
        0.004      & 289       & 201        \\
        0.0041     & 291       & 209        \\
        0.005      & 310       & 250        \\
        0.010      & 311       & 260        \\
        0.020      & 280       & 240        \\ [1ex]
        \hline
    \end{tabular}
    \caption{Force-Deflection data for a beam and a bar}
    \label{table:dat}
\end{table}
\end{document}
```

```tex
% book.tex
\documentclass{book}
\begin{document}
\part{Title of the part 1}
Content of the Part 1
\chapter{Title of the chapter 1}
Content of the chapter 1
\section{Title of the section 1.1}
Content of the section 1.1
\subsection{Title of the subsection 1.1.1}
Content of the subsection 1.1.1.
\paragraph{Title of a paragraph}
Content of a paragraph
\subparagraph{Title of a subparagraph}
Content of a subparagraph
\section*{Title of a unnumbered Section}
Content of a unnumbered section.
\end{document}
```
