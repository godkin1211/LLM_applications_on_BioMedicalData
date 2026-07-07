nextflow.enable.dsl=2

params.input = params.input ?: "sample_manifest.csv"

process CHECK_MANIFEST {
    tag "manifest"

    input:
    path manifest

    output:
    path "manifest.ok.txt"

    script:
    """
    python3 ${projectDir}/../scripts/validate_manifest.py ${manifest}
    echo ok > manifest.ok.txt
    """
}

workflow {
    CHECK_MANIFEST(file(params.input))
}
