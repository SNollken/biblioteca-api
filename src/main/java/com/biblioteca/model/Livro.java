package com.biblioteca.model;

public class Livro {

    private Long id;
    private String nome;
    private String autor;
    private String categoria;
    private boolean emprestado;
    private java.time.LocalDate dataEmprestimo;
    private java.time.LocalDate dataDevolucao;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public boolean isEmprestado() {
        return emprestado;
    }

    public void setEmprestado(boolean emprestado) {
        this.emprestado = emprestado;
    }

    public java.time.LocalDate getDataEmprestimo() {
        return dataEmprestimo;
    }

    public void setDataEmprestimo(java.time.LocalDate dataEmprestimo) {
        this.dataEmprestimo = dataEmprestimo;
    }

    public java.time.LocalDate getDataDevolucao() {
        return dataDevolucao;
    }

    public void setDataDevolucao(java.time.LocalDate dataDevolucao) {
        this.dataDevolucao = dataDevolucao;
    }
}
