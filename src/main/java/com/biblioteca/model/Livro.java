package com.biblioteca.model;

public class Livro {

    private long id;
    private String nome;
    private String autor;
    private String categoria;
    private java.time.LocalDate dataEmprestimo;
    private java.time.LocalDate dataDevolucao;

    public long getId() {
        return id;
    }

    public void setId(long id) {
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
